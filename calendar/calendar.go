package main

import (
	"context"
	"fmt"
	"html/template"
	"log"
	"os"
	"strings"
	"time"

	"github.com/chromedp/chromedp"
	"golang.org/x/oauth2/google"
	"google.golang.org/api/calendar/v3"
	"google.golang.org/api/option"
)

type event struct {
	Summary  string
	Day      int
	Start    time.Time
	Duration time.Duration
	Assoc    string
	Half     bool
	Side     bool
}

type htmlEvent struct {
	Summary string
	Classes string
}

type templateData struct {
	Events []htmlEvent
	Day    int
	Days   []string
}

func weekStart(day time.Time) time.Time {
	year, week := day.ISOWeek()
	// Start from the middle of the year:
	t := time.Date(year, 7, 1, 0, 0, 0, 0, time.UTC)
	// Roll back to Monday:
	if wd := t.Weekday(); wd == time.Sunday {
		t = t.AddDate(0, 0, -6)
	} else {
		t = t.AddDate(0, 0, -int(wd)+1)
	}
	// Difference in weeks:
	_, w := t.ISOWeek()
	t = t.AddDate(0, 0, (week-w)*7)
	return t
}

func getEvents() []event {
	ctx := context.Background()
	b, err := os.ReadFile("credentials.json")
	if err != nil {
		log.Fatalf("Unable to read client secret file: %v", err)
	}
	// If modifying these scopes, delete your previously saved token.json.
	config, err := google.ConfigFromJSON(b, calendar.CalendarReadonlyScope)
	if err != nil {
		log.Fatalf("Unable to parse client secret file to config: %v", err)
	}
	client := getClient(config)

	srv, err := calendar.NewService(ctx, option.WithHTTPClient(client))
	if err != nil {
		log.Fatalf("Unable to retrieve Calendar client: %v", err)
	}
	// Gets Calendar corresponding to "Agenda des Associations"
	calendar, err := srv.CalendarList.Get(os.Getenv("CALENDAR_URL")).Do()
	if err != nil {
		log.Fatalf("Unable to retrieve Calendar: %v", err)
	}
	calID := calendar.Id

	weekStart := weekStart(time.Now())
	weekEnd := weekStart.AddDate(0, 0, 5)
	// Gets events for the current week from the calendar, from earliest to latest
	events, err := srv.Events.List(calID).ShowDeleted(false).
		SingleEvents(true).
		TimeMin(weekStart.Format(time.RFC3339)).
		TimeMax(weekEnd.Format(time.RFC3339)).OrderBy("startTime").Do()
	if err != nil {
		log.Fatalf("Unable to retrieve next ten of the user's events: %v", err)
	}
	var returnEvents []event
	for _, item := range events.Items {
		summary := item.Summary
		start, err := time.Parse(time.RFC3339, item.Start.DateTime)
		if err != nil {
			log.Fatalf("Unable to parse start time: %v", err)
		}
		end, err := time.Parse(time.RFC3339, item.End.DateTime)
		if err != nil {
			log.Fatalf("Unable to parse end time: %v", err)
		}
		rounding, err := time.ParseDuration("30m")
		if err != nil {
			log.Fatalf("Unable to parse duration: %v", err)
		}
		start = start.Round(rounding)
		end = end.Round(rounding)
		duration := end.Sub(start).Round(rounding)
		summaryLower := strings.ToLower(summary)
		assoc := ""
		switch {
		case strings.Contains(summaryLower, "bds"):
			assoc = "bds"
		case strings.Contains(summaryLower, "humani"):
			assoc = "humanitn"
		case strings.Contains(summaryLower, "anim'est"):
			assoc = "animest"
		case strings.Contains(summaryLower, "tns"):
			assoc = "tns"
		default:
			assoc = "ceten"
		}
		// Filters events to only include events and not regular activities
		if strings.Contains(strings.ToLower(summary), "[event]") && duration.Hours() <= 6 {
			newEvent := event{summary, int(start.Weekday()), start, duration, assoc, false, false}
			returnEvents = append(returnEvents, newEvent)
		}
	}
	if len(returnEvents) == 0 {
		return make([]event, 0)
	}
	// Handles event overlap
	for index := range returnEvents[0 : len(returnEvents)-1] {
		first := &returnEvents[index]
		second := &returnEvents[index+1]
		// If two events overlap
		if first.Day == second.Day && first.Start.Before(second.Start.Add(second.Duration)) &&
			second.Start.Before(first.Start.Add(first.Duration)) {
			// Set both events as half width
			first.Half = true
			second.Half = true
			// Set both events at opposite sides
			if first.Side {
				second.Side = false
			} else {
				second.Side = true
			}
		}
	}
	return returnEvents
}

func getHTMLEvent(e event) htmlEvent {
	var half string
	if e.Half {
		half = "half"
	} else {
		half = "full"
	}
	var bis string
	if e.Side {
		bis = "b"
	} else {
		bis = ""
	}
	classes := fmt.Sprintf(
		"calendar-event-card day-%d%s start-%s duration-%s %s %s",
		e.Day,
		bis,
		fmt.Sprintf("%d%d", e.Start.Hour(), e.Start.Minute()),
		fmt.Sprintf("%d", int(e.Duration.Minutes())),
		e.Assoc,
		half,
	)
	return htmlEvent{e.Summary, classes}
}

func fillTemplate(data templateData) {
	t, err := template.New("template.go.tmpl").Funcs(template.FuncMap{
		"Iterate": func(count int) []int {
			var i int
			var Items []int
			for i = 0; i < (count); i++ {
				Items = append(Items, i)
			}
			return Items
		},
	}).ParseFiles("template.go.tmpl")
	if err != nil {
		log.Fatalf("Unable to parse template: %v", err)
	}
	f, err := os.Create("agenda.html")
	if err != nil {
		log.Fatalf("Unable to create file: %v", err)
	}
	err = t.Execute(f, data)
	if err != nil {
		log.Fatalf("Unable to execute template: %v", err)
	}
}

func makeImage() {
	imageName := fmt.Sprintf("Agenda_%s.png", weekStart(time.Now()).Format("20060102"))
	log.Println("Creating image:", imageName)
	ctx, cancel := chromedp.NewContext(
		context.Background(),
		// chromedp.WithDebugf(log.Printf),
	)
	defer cancel()
	path, err := os.Getwd()
	if err != nil {
		log.Fatalf("Unable to get working directory: %v", err)
	}
	var buf []byte
	screenshot := chromedp.Tasks{
		chromedp.Navigate(fmt.Sprintf("file://%s/agenda.html", path)), // Load file into browser
		chromedp.EmulateViewport(1920, 1080),                          // Set viewport to 1920x1080
		chromedp.FullScreenshot(&buf, 100),                            // Take screenshot
	}
	err = chromedp.Run(ctx, screenshot)
	if err != nil {
		log.Fatalf("Unable to run command: %v", err)
	} else {
		err = os.Remove("/app/images/" + imageName)
		if err != nil {
			log.Printf("Unable to remove image: %v", err)
		}
		err = os.WriteFile(imageName, buf, 0644)
		if err != nil {
			log.Fatalf("Unable to write file: %v", err)
		}
		_, err = addImage(imageName)
		if err != nil {
			log.Fatalf("Unable to add image to Redis DB: %v", err)
		}
		oldImageName := fmt.Sprintf("Agenda_%s.png", weekStart(time.Now().AddDate(0, 0, -7)).Format("20060102"))
		err := os.Rename(imageName, "/app/images/"+imageName)
		if err != nil {
			log.Printf("Unable to rename new image: %v", err)
		}
		if _, err := os.Stat("/app/images/" + oldImageName); err == nil {
			log.Println("Deleting old image:", oldImageName)
			err = os.Remove("agenda.html")
			if err != nil {
				log.Printf("Unable to remove file: %v", err)
			}
			_, err = removeImage(oldImageName)
			if err != nil {
				log.Printf("Unable to remove image from Redis DB: %v", err)
			}
		}
		log.Println("Removing template file:", "agenda.html")
		err = os.Remove("/app/images/" + oldImageName)
		if err != nil {
			log.Printf("Unable to remove template file: %v", err)
		}
		log.Println("Moving image into images folder:", "/app/images/"+imageName)
	}
}

// RefreshCalendar : Fetch the events for the current week and save the corresponding image
func RefreshCalendar() {
	var htmlEvents []htmlEvent
	events := getEvents()
	if len(events) == 0 {
		log.Printf("No events found")
	}
	for _, item := range events {
		log.Printf(
			"Event: %s\n-Day: %d\n-Start time: %s\n-Duration %s\nAssoc: %s\n",
			item.Summary,
			item.Day,
			item.Start,
			item.Duration,
			item.Assoc,
		)
		htmlEvents = append(htmlEvents, getHTMLEvent(item))
	}
	data := templateData{
		htmlEvents,
		int(time.Now().Weekday() - 1),
		[]string{"Lun.", "Mar.", "Mer.", "Jeu.", "Ven."},
	}
	fillTemplate(data)
	makeImage()
}
