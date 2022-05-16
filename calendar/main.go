package main

import (
	"context"
	"encoding/json"
	"fmt"
	"html/template"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/chromedp/chromedp"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"google.golang.org/api/calendar/v3"
	"google.golang.org/api/option"
)

type Event struct {
	Summary string
	Day int
	Start time.Time
	Duration time.Duration
	Assoc string
	Half bool
	Side bool
}

type HTMLEvent struct {
	Summary string
	Classes string
}

type TemplateData struct {
	Events []HTMLEvent
	Day int
	Days []string
}

// Retrieve a token, saves the token, then returns the generated client.
func getClient(config *oauth2.Config) *http.Client {
	// The file token.json stores the user's access and refresh tokens, and is
	// created automatically when the authorization flow completes for the first
	// time.
	tokFile := "token.json"
	tok, err := tokenFromFile(tokFile)
	if err != nil {
			tok = getTokenFromWeb(config)
			saveToken(tokFile, tok)
	}
	return config.Client(context.Background(), tok)
}

// Request a token from the web, then returns the retrieved token.
func getTokenFromWeb(config *oauth2.Config) *oauth2.Token {
	authURL := config.AuthCodeURL("state-token", oauth2.AccessTypeOffline)
	fmt.Printf("Go to the following link in your browser then type the "+
			"authorization code: \n%v\n", authURL)

	var authCode string
	if _, err := fmt.Scan(&authCode); err != nil {
			log.Fatalf("Unable to read authorization code: %v", err)
	}

	tok, err := config.Exchange(context.TODO(), authCode)
	if err != nil {
			log.Fatalf("Unable to retrieve token from web: %v", err)
	}
	return tok
}

// Retrieves a token from a local file.
func tokenFromFile(file string) (*oauth2.Token, error) {
	f, err := os.Open(file)
	if err != nil {
			return nil, err
	}
	defer f.Close()
	tok := &oauth2.Token{}
	err = json.NewDecoder(f).Decode(tok)
	return tok, err
}

// Saves a token to a file path.
func saveToken(path string, token *oauth2.Token) {
	fmt.Printf("Saving credential file to: %s\n", path)
	f, err := os.OpenFile(path, os.O_RDWR|os.O_CREATE|os.O_TRUNC, 0600)
	if err != nil {
			log.Fatalf("Unable to cache oauth token: %v", err)
	}
	defer f.Close()
	json.NewEncoder(f).Encode(token)
}

func WeekStart(day time.Time) time.Time {
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

func GetEvents() []Event {
	ctx := context.Background()
	b, err := ioutil.ReadFile("credentials.json")
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
	calendar, err := srv.CalendarList.Get("esial.net_og2ar8u1hdq3mh4v8komg5sbpg@group.calendar.google.com").Do()
	if err != nil {
			log.Fatalf("Unable to retrieve Calendar: %v", err)
	}
	calId := calendar.Id

	weekStart := WeekStart(time.Now())
	weekEnd := weekStart.AddDate(0, 0, 5)
	// Gets events for the current week from the calendar, from earliest to latest
	events, err := srv.Events.List(calId).ShowDeleted(false).
			SingleEvents(true).TimeMin(weekStart.Format(time.RFC3339)).TimeMax(weekEnd.Format(time.RFC3339)).OrderBy("startTime").Do()
	if err != nil {
			log.Fatalf("Unable to retrieve next ten of the user's events: %v", err)
	}
	var returnEvents []Event
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
		summary_lower := strings.ToLower(summary)
		assoc := ""
		switch {
			case strings.Contains(summary_lower, "bds"):
				assoc = "bds"
			case strings.Contains(summary_lower, "humani"):
				assoc = "humanitn"
			case strings.Contains(summary_lower, "anim'est"):
				assoc = "animest"
			case strings.Contains(summary_lower, "tns"):
				assoc = "tns"
			default:
				assoc = "ceten"
		}
		if strings.Contains(strings.ToLower(summary), "[event]") && duration.Hours() <= 6 {
			newEvent := Event{summary, int(start.Weekday()), start, duration, assoc, false, false}
			returnEvents = append(returnEvents, newEvent)
		}
	}
	if len(returnEvents) == 0 {
		return make([]Event, 0)
	}
	for index := range returnEvents[0:len(returnEvents)-1] {
		first := &returnEvents[index]
		second := &returnEvents[index+1]
		if first.Day ==  second.Day && first.Start.Before(second.Start.Add(second.Duration)) && second.Start.Before(first.Start.Add(first.Duration)) {
			first.Half = true
			second.Half = true
			if first.Side {
				second.Side = false
			} else {
				second.Side = true
			}
		}
	}
	return returnEvents
}

func GetHTMLEvent(e Event) HTMLEvent {
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
	classes := fmt.Sprintf("calendar-event-card day-%d%s start-%s duration-%s %s %s", e.Day, bis, fmt.Sprintf("%d%d", e.Start.Hour(), e.Start.Minute()), fmt.Sprintf("%d", int(e.Duration.Minutes())), e.Assoc, half)
	return HTMLEvent{e.Summary, classes}
}

func FillTemplate(data TemplateData) {
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

func MakeImage() {
	imageName := fmt.Sprintf("Agenda_%s.png", WeekStart(time.Now()).Format("20060102"))
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
	var screenshot = chromedp.Tasks{
		chromedp.Navigate(fmt.Sprintf("file://%s/agenda.html", path)),
		chromedp.EmulateViewport(1920, 1080),
		chromedp.FullScreenshot(&buf, 100),
	}
	err = chromedp.Run(ctx, screenshot)
	if err != nil {
		log.Fatalf("Unable to run command: %v", err)
	} else {
		err = os.Remove("../images/" + imageName)
		if err != nil {
			log.Fatalf("Unable to remove image: %v", err)
		}
		err = ioutil.WriteFile(imageName, buf, 0644)
		if err != nil {
			log.Fatalf("Unable to write file: %v", err)
		}
		oldImageName := fmt.Sprintf("Agenda_%s.png", WeekStart(time.Now().AddDate(0, 0, -7)).Format("20060102"))
		err := os.Rename(imageName, "../images/" + imageName)
		if err != nil {
			log.Fatalf("Unable to rename image: %v", err)
		}
		log.Println("Deleting old image:", oldImageName)
		err = os.Remove("agenda.html")
		if err != nil {
			log.Fatalf("Unable to remove file: %v", err)
		}
		log.Println("Removing template file:", "agenda.html")
		err = os.Remove("../images/" + oldImageName)
		if err != nil {
			log.Fatalf("Unable to rename image: %v", err)
		}
		log.Println("Moving image into images folder:", "../images/" + imageName)
	}
}

func main() {
	var	htmlEvents []HTMLEvent
	events := GetEvents()
	if len(events) == 0 {
		log.Fatalf("No events found")
	}
	for _, item := range events {
		fmt.Printf("Event: %s\n-Day: %d\n-Start time: %s\n-Duration %s\nAssoc: %s\n", item.Summary, item.Day, item.Start, item.Duration, item.Assoc)
		htmlEvents = append(htmlEvents, GetHTMLEvent(item))
	}
	data := TemplateData{htmlEvents, int(time.Now().Weekday() - 1), []string{"Lun.", "Mar.", "Mer.", "Jeu.", "Ven."}}
	FillTemplate(data)
	MakeImage()
}