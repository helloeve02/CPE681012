package unit

import (
	"testing"
	"github.com/helloeve02/CPE681012/entity"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestFoodFlagID(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`food_flag_id is required`, func(t *testing.T) {
		fooditem := entity.FoodItem{
			FoodFlagID: 0,
			Name:      "องุ่นเขียว",
			Image:       "https://medthai.com/wp-content/uploads/2014/07/%E0%B8%AD%E0%B8%87%E0%B8%B8%E0%B9%88%E0%B8%99.jpg",
			Credit:          "https://medthai.com/%E0%B8%AD%E0%B8%87%E0%B8%B8%E0%B9%88%E0%B8%99/",
			Description:        "โพแทสเซียมต่ำ",
		}
		ok, err := govalidator.ValidateStruct(fooditem)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("FoodFlagID is required"))

	})
}

func TestName(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`name is required`, func(t *testing.T) {
		fooditem := entity.FoodItem{
			FoodFlagID: 4,
			Name:      "",
			Image:       "https://medthai.com/wp-content/uploads/2014/07/%E0%B8%AD%E0%B8%87%E0%B8%B8%E0%B9%88%E0%B8%99.jpg",
			Credit:          "https://medthai.com/%E0%B8%AD%E0%B8%87%E0%B8%B8%E0%B9%88%E0%B8%99/",
			Description:        "โพแทสเซียมต่ำ",
		}
		ok, err := govalidator.ValidateStruct(fooditem)
		
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("Name is required"))

	})
}

/* func TestImage(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`image is required`, func(t *testing.T) {
		fooditem := entity.FoodItem{
			FoodFlagID: 4,
			Name:      "องุ่นเขียว",
			Image:       "",
			Credit:          "https://medthai.com/%E0%B8%AD%E0%B8%87%E0%B8%B8%E0%B9%88%E0%B8%99/",
			Description:        "โพแทสเซียมต่ำ",
		}
		ok, err := govalidator.ValidateStruct(fooditem)
		
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("Image is required"))

	})

	t.Run(`image must be a valid url`, func(t *testing.T) {
		fooditem := entity.FoodItem{
			FoodFlagID: 4,
			Name:      "องุ่นเขียว",
			Image:       "grape.jpg",
			Credit:          "",
			Description:        "โพแทสเซียมต่ำ",
		}
		ok, err := govalidator.ValidateStruct(fooditem)
		
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("Image must be a valid URL"))

	})
} */
/* func TestCredit(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`credit is required`, func(t *testing.T) {
		fooditem := entity.FoodItem{
			FoodFlagID: 4,
			Name:      "องุ่นเขียว",
			Image:       "https://medthai.com/wp-content/uploads/2014/07/%E0%B8%AD%E0%B8%87%E0%B8%B8%E0%B9%88%E0%B8%99.jpg",
			Credit:          "",
			Description:        "โพแทสเซียมต่ำ",
		}
		ok, err := govalidator.ValidateStruct(fooditem)
		
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("Credit is required"))

	})
	t.Run(`credit must be a valid url`, func(t *testing.T) {
		fooditem := entity.FoodItem{
			FoodFlagID: 4,
			Name:      "องุ่นเขียว",
			Image:       "https://medthai.com/wp-content/uploads/2014/07/%E0%B8%AD%E0%B8%87%E0%B8%B8%E0%B9%88%E0%B8%99.jpg",
			Credit:          "medthai",
			Description:        "โพแทสเซียมต่ำ",
		}
		ok, err := govalidator.ValidateStruct(fooditem)
		
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("Credit must be a valid URL"))

	})
}
 */
/* func TestDescription(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`description is required`, func(t *testing.T) {
		fooditem := entity.FoodItem{
			FoodFlagID: 4,
			Name:      "องุ่นเขียว",
			Image:       "https://medthai.com/wp-content/uploads/2014/07/%E0%B8%AD%E0%B8%87%E0%B8%B8%E0%B9%88%E0%B8%99.jpg",
			Credit:          "https://medthai.com/%E0%B8%AD%E0%B8%87%E0%B8%B8%E0%B9%88%E0%B8%99/",
			Description:        "",
		}
		ok, err := govalidator.ValidateStruct(fooditem)
	
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("Description is required"))

	})
} */

func TestFoodItemValid(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`valid`, func(t *testing.T) {
		fooditem := entity.FoodItem{
			FoodFlagID: 4,
			Name:      "องุ่นเขียว",
			Image:       "https://medthai.com/wp-content/uploads/2014/07/%E0%B8%AD%E0%B8%87%E0%B8%B8%E0%B9%88%E0%B8%99.jpg",
			Credit:          "https://medthai.com/%E0%B8%AD%E0%B8%87%E0%B8%B8%E0%B9%88%E0%B8%99/",
			Description:        "โพแทสเซียมต่ำ",
		}
		
		ok, err := govalidator.ValidateStruct(fooditem)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}