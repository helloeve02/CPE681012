package unit

import (
	"testing"
	"github.com/helloeve02/CPE681012/entity"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestAdminFirstName(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`frst_name is required`, func(t *testing.T) {
		admin := entity.Admin{
			FirstName: "",
			LastName:  "Sinchan",
			UserName: "dlwlrqwa",
			Password:  "123456",
		}
		ok, err := govalidator.ValidateStruct(admin)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("FirstName is required"))

	})
}

func TestAdminLastName(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`last_name is required`, func(t *testing.T) {
		admin := entity.Admin{
			FirstName: "Nattawadee",
			LastName:  "",
			UserName: "dlwlrqwa",
			Password:  "123456",
		}
		ok, err := govalidator.ValidateStruct(admin)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("LastName is required"))

	})
}

func TestAdminUserName(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`user_name is required`, func(t *testing.T) {
		admin := entity.Admin{
			FirstName: "Nattawadee",
			LastName:  "Sinchan",
			UserName: "",
			Password:  "123456",
		}
		ok, err := govalidator.ValidateStruct(admin)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("UserName is required"))

	})
}

func TestAdminValid(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`valid`, func(t *testing.T) {
			admin := entity.Admin{
			FirstName: "Nattawadee",
			LastName:  "Sinchan",
			UserName: "dlwlrqwa",
			Password:  "123456",
		}
		
		ok, err := govalidator.ValidateStruct(admin)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}