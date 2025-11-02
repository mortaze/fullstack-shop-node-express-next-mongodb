// const bcrypt = require('bcryptjs');
// const admins = [
//   {
//     name:'Dorothy R. Brown',
//     image: "https://i.ibb.co/wpjNftS/user-2.jpg",
//     email: "dorothy@gmail.com",
//     password: "123456",
//     phone: "708-628-3122",
//     role: "Admin",
//     joiningData: new Date()
//   },
//   {
//     name:'Alice B. Porter',
//     image: "https://i.ibb.co/wpjNftS/user-2.jpg",
//     email: "porter@gmail.com",
//     password: bcrypt.hashSync("123456"),
//     phone: "708-628-3122",
//     role: "Admin",
//     joiningData: new Date()
//   },
//   {
//     name:'Corrie H. Cates',
//     image: "https://i.ibb.co/wpjNftS/user-2.jpg",
//     email: "corrie@gmail.com",
//     password: bcrypt.hashSync("123456"),
//     phone: "708-628-3122",
//     role: "Admin",
//     joiningData: new Date()
//   },
//   {
//     name:'Shawn E. Palmer',
//     image: "https://i.ibb.co/wpjNftS/user-2.jpg",
//     email: "palmer@gmail.com",
//     password: bcrypt.hashSync("123456"),
//     phone: "902-628-3122",
//     role: "CEO",
//     joiningData: new Date()
//   },
//   {
//     name:'Stacey J. Meikle',
//     image: "https://i.ibb.co/wpjNftS/user-2.jpg",
//     email: "meikle@gmail.com",
//     password: "123456",
//     phone: "102-628-3122",
//     role: "Manager",
//     joiningData: new Date()
//   },{
//   name: 'مرتضی محمدی',
//   image: "https://i.ibb.co/wpjNftS/user-2.jpg", // می‌تونی لینک عکس خودت بذاری
//   email: "mohsenmahdi404@gmail.com", // ایمیل خودت
//   status: "active",
//   password: "09123219809mm",
//   phone: "0912-XXX-XXXX",
//   role: "Admin", // یا CEO / Manager
//   joiningData: new Date()
// }
// ];

// module.exports = admins;


const Admin = require("../model/Admin"); // مدل ادمین
const bcrypt = require("bcryptjs");

/**
 * این تابع تمام ادمین‌ها را از دیتابیس MongoDB آنلاین برمی‌گرداند
 * در صورتی که دیتابیس خالی بود، می‌تونی تصمیم بگیری داده‌ی پیش‌فرض اضافه کنی
 */
const getAdminsFromDB = async () => {
  try {
    const admins = await Admin.find(); // تمام ادمین‌ها
    if (!admins.length) {
      console.log("⚠️ هیچ ادمینی در دیتابیس یافت نشد.");
      // در صورت نیاز، می‌تونی اینجا داده‌ی پیش‌فرض اضافه کنی:
      /*
      const defaultAdmin = await Admin.create({
        name: "Super Admin",
        email: "admin@example.com",
        password: bcrypt.hashSync("123456", 10),
        role: "Admin",
        phone: "000-000-0000",
        image: "https://i.ibb.co/wpjNftS/user-2.jpg",
        joiningData: new Date()
      });
      return [defaultAdmin];
      */
    }
    return admins;
  } catch (error) {
    console.error("❌ خطا در واکشی ادمین‌ها:", error);
    return [];
  }
};

module.exports = getAdminsFromDB;
