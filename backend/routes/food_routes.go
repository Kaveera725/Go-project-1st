package routes

import (
	"hotel-menu-api/controllers"

	"github.com/gin-gonic/gin"
)

// RegisterFoodRoutes sets up all /api/foods endpoints
func RegisterFoodRoutes(router *gin.Engine) {
	api := router.Group("/api")
	{
		api.POST("/foods", controllers.CreateFood)
		api.GET("/foods", controllers.GetAllFoods)
		api.GET("/foods/:id", controllers.GetFoodByID)
		api.PUT("/foods/:id", controllers.UpdateFood)
		api.DELETE("/foods/:id", controllers.DeleteFood)
	}
}
