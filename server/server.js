import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import userRouter from "./routes/UserRoute.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import statusRouter from "./routes/StatusRoute.js";
import examRouter from "./routes/ExamRoute.js";
import categoryRouter from "./routes/CategoryRoute.js";
import courseRouter from "./routes/CourseRoute.js";
import propertyRouter from "./routes/PropertyRoute.js";
import locationRouter from "./routes/LocationRouter.js";
import hostelRouter from "./routes/HostelRouter.js";
import faqsRouter from "./routes/FaqsRouter.js";
import scholarshipRouter from "./routes/ScholarshipRouter.js";
import announcementRouter from "./routes/AnnouncementRouter.js";
import facultyRouter from "./routes/FacultyRouter.js";
import reviewsRouter from "./routes/ReviewsRouter.js";
import questionandanswerRouter from "./routes/QuestionAndAnswerRouter.js";
import otherBasicDetailsRouter from "./routes/OtherBasicDetailsRouter.js";
import otherDetailsRouter from "./routes/OtherDetailsRouter.js";
import seoRouter from "./routes/SeoRouter.js";
import galleryRouter from "./routes/GalleryRouter.js";
import propertyCourseRouter from "./routes/PropertyCourseRouter.js";
import amenitiesRouter from "./routes/AmenitiesRouter.js";
import admissionProcessRouter from "./routes/AdmissionProcessRoute.js";
import loanProcessRouter from "./routes/LoanProcessRoute.js";
import enquiryRouter from "./routes/EnquiryRoute.js";

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan("common"));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(express.static("public"));
app.use("/media", express.static("media"));

app.use(
    cors({
        origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
        credentials: true,
    })
);

app.use("/api/", userRouter);
app.use("/api/", statusRouter);
app.use("/api/", examRouter);
app.use("/api/", categoryRouter);
app.use("/api/", courseRouter);
app.use("/api/", propertyRouter);
app.use("/api/", locationRouter);
app.use("/api/", hostelRouter);
app.use("/api/", faqsRouter);
app.use("/api/", scholarshipRouter);
app.use("/api/", announcementRouter);
app.use("/api/", facultyRouter);
app.use("/api/", reviewsRouter);
app.use("/api/", questionandanswerRouter);
app.use("/api/", otherBasicDetailsRouter);
app.use("/api/", otherDetailsRouter);
app.use("/api/", seoRouter);
app.use("/api/", galleryRouter);
app.use("/api/", propertyCourseRouter);
app.use("/api/", amenitiesRouter);
app.use("/api/", admissionProcessRouter);
app.use("/api/", loanProcessRouter);
app.use("/api/", enquiryRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});