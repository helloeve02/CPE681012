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

   {
       router.Use(middlewares.Authorizes())
       r.GET("/menu", controller.GetAllMenu)
       r.GET("/menu/:id", controller.GetMenuByID)
       r.GET("/diseases", controller.GetAllDisease)
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