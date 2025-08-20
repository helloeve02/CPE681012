package main


import (
   "net/http"
   "github.com/gin-gonic/gin"
   "github.com/helloeve02/CPE681012/config"
   "github.com/helloeve02/CPE681012/middlewares"
   "github.com/helloeve02/CPE681012/controller"

)


const PORT = "8000"


func main() {

   config.ConnectionDB() //ยังไม่ได้เขียน db
   config.SetupDatabase() //ยังไม่ได้เขียน db
   r := gin.Default()
   r.Use(CORSMiddleware())

   router := r.Group("/")
    r.POST("/signin", controller.SignIn)
   {
       router.Use(middlewares.Authorizes())
       r.GET("/menu", controller.GetAllMenu)
       r.GET("/menu/:id", controller.GetMenuByID)
       r.GET("/ingredients", controller.GetAllIngredients)
       r.GET("/ingredients/:id", controller.GetIngredientsByID)
       r.GET("/diseases", controller.GetAllDisease)
       r.POST("/rule", controller.FindRuleByUserInfo)
       r.GET("/nutritionrecommendation/:rule", controller.GetNutritionRecommendationByRule)
       r.GET("/portionrecommendation/:rule", controller.GetPortionRecommendationByRule)
       r.GET("/ruledetail/:rule", controller.GetRuleDetailsByRuleID)
       r.GET("/calories/:rule", controller.GetCaloriesByRuleID)
       r.GET("/admin",controller.ListUsers)
       r.GET("/admin/:id",controller.GetUserByID)
       r.GET("/tag",controller.GetAllTag)
       r.GET("/tag/:id",controller.GetTagByID)
       r.GET("/menu-tag",controller.GetAllMenuTag)
       r.GET("/menu-tag/:id",controller.GetMenuTagByID)
    //    r.GET("/menu-tag/:id",controller.HandleGetMenus)
   }



   r.GET("/", func(c *gin.Context) {

       c.String(http.StatusOK, "API RUNNING... PORT: %s", PORT)

   })


   // Run the server


   r.Run("localhost:" + PORT)


}


func CORSMiddleware() gin.HandlerFunc {

   return func(c *gin.Context) {

       c.Writer.Header().Set("Access-Control-Allow-Origin", "*")

       c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")

       c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")

       c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")


       if c.Request.Method == "OPTIONS" {

           c.AbortWithStatus(204)

           return

       }


       c.Next()

   }

}