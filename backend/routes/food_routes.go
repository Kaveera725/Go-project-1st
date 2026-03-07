package routes

import (
	"hotel-menu-api/controllers"
	"hotel-menu-api/middleware"

	"github.com/gin-gonic/gin"
)

// RegisterFoodRoutes sets up all API endpoints
func RegisterFoodRoutes(router *gin.Engine) {
	api := router.Group("/api")
	{
		// ── Auth routes (public) ──
		api.POST("/auth/register", controllers.Register)
		api.POST("/auth/login", controllers.Login)

		// ── Public food routes (anyone can read menu) ──
		api.GET("/foods", controllers.GetAllFoods)
		api.GET("/foods/:id", controllers.GetFoodByID)

		// ── Protected routes (require login) ──
		auth := api.Group("")
		auth.Use(middleware.AuthRequired())
		{
			// Current user
			auth.GET("/auth/me", controllers.GetMe)

			// Customer order routes
			auth.POST("/orders", controllers.CreateOrder)
			auth.GET("/orders/my", controllers.GetMyOrders)

			// Admin-only routes
			admin := auth.Group("")
			admin.Use(middleware.AdminOnly())
			{
				admin.POST("/foods", controllers.CreateFood)
				admin.PUT("/foods/:id", controllers.UpdateFood)
				admin.DELETE("/foods/:id", controllers.DeleteFood)
				admin.GET("/orders", controllers.GetAllOrders)
				admin.PUT("/orders/:id/status", controllers.UpdateOrderStatus)
			}
		}
	}
}
