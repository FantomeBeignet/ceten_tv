package main

import (
	"context"
	"github.com/redis/go-redis/v9"
	"os"
)

var rdb = redis.NewClient(&redis.Options{
	Addr:     "redis:6379",
	Password: os.Getenv("REDIS_PASSWORD"),
	DB:       0, // use default DB
})

func addImage(image string) (int64, error) {
	res, err := rdb.SAdd(context.Background(), "visible", image).Result()
	return res, err
}

func removeImage(image string) (int64, error) {
	res1, err1 := rdb.SRem(context.Background(), "visible", image).Result()
	if err1 != nil {
		return res1, err1
	}
	res2, err2 := rdb.SRem(context.Background(), "hidden", image).Result()
	return res1 + res2, err2
}
