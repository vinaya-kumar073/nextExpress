import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: {
      type: String,
      match: /^\+\d{6,15}$/,
      unique: true,
      sparse: true,
    },
    password: { type: String, required: true },
    profileImage: {
      data: Buffer,
      contentType: String,
    },

    is_verified: { type: Boolean, default: false },
    status: {
      type: String,
      enum: [
        "PENDING",
        "ACCEPTED",
        "ACTIVE",
        "REJECTED",
        "HOLD",
        "RESIGNED",
        "BENCH",
        "NOTICE_PERIOD",
        "TERMINATED",
      ],
      default: "PENDING",
    },
    roles: {
      type: [String],
      enum: [
        "student",
        "parent",
        "instructor",
        "admin",
        "tutorAcquisition",
        "salesPerson",
        "operationsPerson",
        "accountant",
        "technicalPerson",
      ],
      default: ["student"],
    },

    adminType: {
      type: String,
      enum: ["owner", "crm", "poc", "manager","teamlead", "coordinator"],
      required: function () {
        return this.roles.includes("admin");
      },
    },
    technicalPersonType: {
      type: String,
      enum: ["manager", "member"],
      required: function () {
        return this.roles.includes("technicalPerson");
      },
    },
    taType: {
      type: String,
      enum: ["manager", "teamlead", "poc"],
      required: function () {
        return this.roles.includes("tutorAcquisition");
      },
    },
    salesPersonType: {
      type: String,
      enum: ["manager", "teamlead", "poc"],
      required: function () {
        return this.roles.includes("salesPerson");
      },
    },
    operationsPersonType: {
      type: String,
      enum: ["manager", "teamlead", "poc"],
      required: function () {
        return this.roles.includes("operationsPerson");
      },
    },
    accountantType: {
      type: String,
      enum: ["manager", "teamlead", "poc"],
      required: function () {
        return this.roles.includes("accountant");
      },
    },

    customId: {
      type: String,
      unique: true,
      sparse: true,
    },

    // Who this employee reports to
    reportingTo: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null,
      }
    ],

    // direct team
    subordinates: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    
    // Course relation (works for all roles)
    courses: [{ type: Schema.Types.ObjectId, ref: "LiveCourse" }],

    // Parent-child relation (for student-parent link)
    parent: { type: Schema.Types.ObjectId, ref: "User" }, // if this user is a student
    children: [{ type: Schema.Types.ObjectId, ref: "User" }], // if this user is a parent
    theme: {
      type: String,
      enum: ["light", "dark"],
      default: "light", // default light
    },
    loginZone: {
      ip: { type: String, default: 'Unknown' },
      country: { type: String, default: 'Unknown' },
      city: { type: String, default: 'Unknown' },
      timezone: { type: String, default: 'Unknown' },
    },
    deviceTokens: {
      type: [
        {
          token: { type: String, required: true },
          platform: { type: String, enum: ['android', 'ios', 'web'], required: true },
          addedAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    }
  },
  { timestamps: true }   
);

const UserModel = model("fUser", userSchema);
export default UserModel;


// db.fusers.insertMany([
//   {
//     "name": "Rahul Sharma",
//     "email": "rahul.sharma@example.com",
//     "phoneNumber": "+919876543210",
//     "password": "Rahul@123",
//     "is_verified": true,
//     "status": "ACTIVE",
//     "roles": ["student"],
//     "courses": [],
//     "parent": null,
//     "children": [],
//     "theme": "light",
//     "loginZone": {
//       "ip": "103.25.48.10",
//       "country": "India",
//       "city": "Hyderabad",
//       "timezone": "Asia/Kolkata"
//     },
//     "deviceTokens": []
//   },
//   {
//     "name": "Priya Sharma",
//     "email": "priya.sharma@example.com",
//     "phoneNumber": "+919876543211",
//     "password": "Priya@123",
//     "is_verified": true,
//     "status": "ACTIVE",
//     "roles": ["parent"],
//     "courses": [],
//     "children": [],
//     "theme": "light",
//     "loginZone": {
//       "ip": "103.25.48.11",
//       "country": "India",
//       "city": "Hyderabad",
//       "timezone": "Asia/Kolkata"
//     },
//     "deviceTokens": []
//   },
//   {
//     "name": "Arjun Reddy",
//     "email": "arjun.reddy@example.com",
//     "phoneNumber": "+919876543212",
//     "password": "Arjun@123",
//     "is_verified": true,
//     "status": "ACTIVE",
//     "roles": ["instructor"],
//     "customId": "INS001",
//     "courses": [],
//     "theme": "dark",
//     "loginZone": {
//       "ip": "103.25.48.12",
//       "country": "India",
//       "city": "Bengaluru",
//       "timezone": "Asia/Kolkata"
//     },
//     "deviceTokens": []
//   },
//   {
//     "name": "Vikram Rao",
//     "email": "vikram.rao@example.com",
//     "phoneNumber": "+919876543213",
//     "password": "Vikram@123",
//     "is_verified": true,
//     "status": "ACTIVE",
//     "roles": ["admin"],
//     "adminType": "owner",
//     "customId": "ADM001",
//     "courses": [],
//     "theme": "dark",
//     "loginZone": {
//       "ip": "103.25.48.13",
//       "country": "India",
//       "city": "Hyderabad",
//       "timezone": "Asia/Kolkata"
//     },
//     "deviceTokens": []
//   },
//   {
//     "name": "Sneha Kapoor",
//     "email": "sneha.kapoor@example.com",
//     "phoneNumber": "+919876543214",
//     "password": "Sneha@123",
//     "is_verified": true,
//     "status": "ACTIVE",
//     "roles": ["admin"],
//     "adminType": "manager",
//     "customId": "ADM002",
//     "courses": [],
//     "theme": "light",
//     "loginZone": {
//       "ip": "103.25.48.14",
//       "country": "India",
//       "city": "Chennai",
//       "timezone": "Asia/Kolkata"
//     },
//     "deviceTokens": []
//   },
//   {
//     "name": "Kiran Kumar",
//     "email": "kiran.kumar@example.com",
//     "phoneNumber": "+919876543215",
//     "password": "Kiran@123",
//     "is_verified": true,
//     "status": "ACCEPTED",
//     "roles": ["tutorAcquisition"],
//     "taType": "manager",
//     "customId": "TA001",
//     "courses": [],
//     "theme": "light",
//     "loginZone": {
//       "ip": "103.25.48.15",
//       "country": "India",
//       "city": "Hyderabad",
//       "timezone": "Asia/Kolkata"
//     },
//     "deviceTokens": []
//   },
//   {
//     "name": "Anjali Mehta",
//     "email": "anjali.mehta@example.com",
//     "phoneNumber": "+919876543216",
//     "password": "Anjali@123",
//     "is_verified": true,
//     "status": "ACTIVE",
//     "roles": ["salesPerson"],
//     "salesPersonType": "teamlead",
//     "customId": "SAL001",
//     "courses": [],
//     "theme": "light",
//     "loginZone": {
//       "ip": "103.25.48.16",
//       "country": "India",
//       "city": "Mumbai",
//       "timezone": "Asia/Kolkata"
//     },
//     "deviceTokens": []
//   },
//   {
//     "name": "Rohit Verma",
//     "email": "rohit.verma@example.com",
//     "phoneNumber": "+919876543217",
//     "password": "Rohit@123",
//     "is_verified": true,
//     "status": "ACTIVE",
//     "roles": ["operationsPerson"],
//     "operationsPersonType": "manager",
//     "customId": "OPS001",
//     "courses": [],
//     "theme": "dark",
//     "loginZone": {
//       "ip": "103.25.48.17",
//       "country": "India",
//       "city": "Pune",
//       "timezone": "Asia/Kolkata"
//     },
//     "deviceTokens": []
//   },
//   {
//     "name": "Meena Iyer",
//     "email": "meena.iyer@example.com",
//     "phoneNumber": "+919876543218",
//     "password": "Meena@123",
//     "is_verified": true,
//     "status": "ACTIVE",
//     "roles": ["accountant"],
//     "accountantType": "poc",
//     "customId": "ACC001",
//     "courses": [],
//     "theme": "light",
//     "loginZone": {
//       "ip": "103.25.48.18",
//       "country": "India",
//       "city": "Bengaluru",
//       "timezone": "Asia/Kolkata"
//     },
//     "deviceTokens": []
//   },
//   {
//     "name": "Suresh Babu",
//     "email": "suresh.babu@example.com",
//     "phoneNumber": "+919876543219",
//     "password": "Suresh@123",
//     "is_verified": true,
//     "status": "ACTIVE",
//     "roles": ["technicalPerson"],
//     "technicalPersonType": "manager",
//     "customId": "TECH001",
//     "courses": [],
//     "theme": "dark",
//     "loginZone": {
//       "ip": "103.25.48.19",
//       "country": "India",
//       "city": "Hyderabad",
//       "timezone": "Asia/Kolkata"
//     },
//     "deviceTokens": []
//   }
// ])