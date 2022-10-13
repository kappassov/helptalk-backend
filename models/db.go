package db

import (
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"github.com/spf13/viper"
	"fmt"
)

const (
    HOST = "seniordb.csmmqn9yk8xp.eu-north-1.rds.amazonaws.com"
    PORT = 5432
    USER = "postgres"
    PASSWORD = "seniorproject"
    DBNAME = "seniordb"
)

func NewDb() *gorm.DB {
	dbUrl := fmt.Sprintf(
        "host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
        HOST, PORT, USER, PASSWORD, DBNAME,
    )
	db, err := gorm.Open("postgres", dbUrl)
	if err != nil {
		panic("failed to connect database")
	}

	db.DB().SetMaxIdleConns(viper.GetInt("DB_MAX_CONNECTIONS"))
	db.DB().SetMaxOpenConns(viper.GetInt("DB_MAX_CONNECTIONS"))
	db.LogMode(viper.GetBool("DB_LOG_MODE"))

	return db
}