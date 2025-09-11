package unit
import (
	"testing"
	"github.com/helloeve02/CPE681012/entity"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestEducationalGroupID(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`educational_group_id is required`, func(t *testing.T) {
		educationalcontent := entity.EducationalContent{
			EducationalGroupID: 0,
			ContentCategoryID:   2,
			Title:       "5 อาหารบำรุงไต กินบ่อยไตดีแน่นอน |รู้ไว้จะได้ไม่ป่วย|โรคไต|ไตวาย",
			PictureIn:          "",
			PictureOut:"",
			Link:"https://youtu.be/UpfCtfgo6KU",
			Credit:"https://www.youtube.com/@ajarnkarn24",
			Description:"ไตเป็นอวัยวะที่สำคัญของร่างกาย มีหน้าที่กำจัดของเสียออกจากร่างกายในรูปปัสสาวะ ปรับสมดุลย์กรดด่างและสร้างฮอร์โมน  การดูแลไตโดยเพิ่มค่าการทำงานของไตทำให้ไตทำงานได้ดีขึ้นจะเป็นทางรอด",
		}
		ok, err := govalidator.ValidateStruct(educationalcontent)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("EducationalGroupID is required"))

	})
}

func TestContentCategoryID(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`content_category_id is required`, func(t *testing.T) {
		educationalcontent := entity.EducationalContent{
			EducationalGroupID: 1,
			ContentCategoryID:   0,
			Title:       "5 อาหารบำรุงไต กินบ่อยไตดีแน่นอน |รู้ไว้จะได้ไม่ป่วย|โรคไต|ไตวาย",
			PictureIn:          "",
			PictureOut:"",
			Link:"https://youtu.be/UpfCtfgo6KU",
			Credit:"https://www.youtube.com/@ajarnkarn24",
			Description: "ไตเป็นอวัยวะที่สำคัญของร่างกาย มีหน้าที่กำจัดของเสียออกจากร่างกายในรูปปัสสาวะ ปรับสมดุลย์กรดด่างและสร้างฮอร์โมน  การดูแลไตโดยเพิ่มค่าการทำงานของไตทำให้ไตทำงานได้ดีขึ้นจะเป็นทางรอด",
		}
		ok, err := govalidator.ValidateStruct(educationalcontent)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("ContentCategoryID is required"))

	})
}

func TestTitle(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`title is required`, func(t *testing.T) {
		educationalcontent := entity.EducationalContent{
			EducationalGroupID: 1,
			ContentCategoryID:  2,
			Title:       "",
			PictureIn:          "",
			PictureOut:"",
			Link:"https://youtu.be/UpfCtfgo6KU",
			Credit:"https://www.youtube.com/@ajarnkarn24",
			Description:"ไตเป็นอวัยวะที่สำคัญของร่างกาย มีหน้าที่กำจัดของเสียออกจากร่างกายในรูปปัสสาวะ ปรับสมดุลย์กรดด่างและสร้างฮอร์โมน  การดูแลไตโดยเพิ่มค่าการทำงานของไตทำให้ไตทำงานได้ดีขึ้นจะเป็นทางรอด",
		}
		ok, err := govalidator.ValidateStruct(educationalcontent)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("Title is required"))

	})
}

func TestDescription(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`description is required`, func(t *testing.T) {
		educationalcontent := entity.EducationalContent{
			EducationalGroupID: 1,
			ContentCategoryID:  2,
			Title:       "5 อาหารบำรุงไต กินบ่อยไตดีแน่นอน |รู้ไว้จะได้ไม่ป่วย|โรคไต|ไตวาย",
			PictureIn:          "",
			PictureOut:"",
			Link:"https://youtu.be/UpfCtfgo6KU",
			Credit:"https://www.youtube.com/@ajarnkarn24",
			Description: "",
		}
		ok, err := govalidator.ValidateStruct(educationalcontent)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("Description is required"))

	})
}

func TestEducationContentnValid(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`valid`, func(t *testing.T) {
		educationalcontent := entity.EducationalContent{
			EducationalGroupID: 1,
			ContentCategoryID:  2,
			Title:       "5 อาหารบำรุงไต กินบ่อยไตดีแน่นอน |รู้ไว้จะได้ไม่ป่วย|โรคไต|ไตวาย",
			PictureIn:          "",
			PictureOut:"",
			Link:"https://youtu.be/UpfCtfgo6KU",
			Credit:"https://www.youtube.com/@ajarnkarn24",
			Description: "ไตเป็นอวัยวะที่สำคัญของร่างกาย มีหน้าที่กำจัดของเสียออกจากร่างกายในรูปปัสสาวะ ปรับสมดุลย์กรดด่างและสร้างฮอร์โมน  การดูแลไตโดยเพิ่มค่าการทำงานของไตทำให้ไตทำงานได้ดีขึ้นจะเป็นทางรอด",
		}
		
		ok, err := govalidator.ValidateStruct(educationalcontent)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}