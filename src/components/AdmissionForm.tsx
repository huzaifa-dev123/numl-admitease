import React, { FormEvent, useState } from "react";
import { toast } from "sonner";
import {
  BookOpen,
  Send,
  GraduationCap,
  FileCheck,
  BadgeCheck,
  Building,
  Briefcase,
  CreditCard,
  Landmark,
  Medal,
  Home,
  Heart,
  Globe,
  Languages,
  Clock,
  Pencil,
  FileText,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import DocumentUpload from "./DocumentUpload";
import OcrProcessing from "./OcrProcessing";
import FormField from "./FormField";
import { processDocumentWithOcr, OcrData } from "@/services/ocrService";
import { saveToFirebase } from "../services/firebaseService";

interface FormState {
  // Personal Information
  full_name: string;
  cnic: string;
  dob: string;
  father_name: string;
  mother_name: string;
  gender: string;
  religion: string;
  marital_status: string;
  blood_group: string;
  address: string;
  permanent_address: string;
  city: string;
  nationality: string;
  phone: string;
  emergency_contact: string;
  email: string;
  domicile: string;

  // Academic Information
  matric_percentage: string;
  matric_board: string;
  matric_passing_year: string;
  matric_roll_number: string;
  matric_subjects: string;

  fsc_percentage: string;
  fsc_board: string;
  fsc_passing_year: string;
  fsc_roll_number: string;
  fsc_subjects: string;

  additional_qualification: string;

  // Program Selection
  department: string;
  program: string;
  campus: string;
  study_mode: string;
  semester: string;

  // Financial Information
  fee_payment_method: string;
  scholarship_applied: string;
  need_financial_aid: string;
  income_source: string;
  monthly_income: string;

  // Additional Information
  extra_curricular: string;
  disabilities: string;
  how_did_you_hear: string;
  languages_known: string;
}

const initialFormState: FormState = {
  // Personal Information
  full_name: "",
  cnic: "",
  dob: "",
  father_name: "",
  mother_name: "",
  gender: "",
  religion: "",
  marital_status: "",
  blood_group: "",
  address: "",
  permanent_address: "",
  city: "",
  nationality: "",
  phone: "",
  emergency_contact: "",
  email: "",
  domicile: "",

  // Academic Information
  matric_percentage: "",
  matric_board: "",
  matric_passing_year: "",
  matric_roll_number: "",
  matric_subjects: "",

  fsc_percentage: "",
  fsc_board: "",
  fsc_passing_year: "",
  fsc_roll_number: "",
  fsc_subjects: "",

  additional_qualification: "",

  // Program Selection
  department: "",
  program: "",
  campus: "",
  study_mode: "",
  semester: "",

  // Financial Information
  fee_payment_method: "",
  scholarship_applied: "",
  need_financial_aid: "",
  income_source: "",
  monthly_income: "",

  // Additional Information
  extra_curricular: "",
  disabilities: "",
  how_did_you_hear: "",
  languages_known: "",
};

const AdmissionForm: React.FC = () => {
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [autoFilledFields, setAutoFilledFields] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentDocumentType, setCurrentDocumentType] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");

  const handleFileSelect = async (file: File, documentType: string) => {
    setSelectedFile(file);
    setCurrentDocumentType(documentType);
    setIsProcessing(true);
    setProgress(0);

    try {
      // Process document with OCR
      const extractedData = await processDocumentWithOcr(
        file,
        documentType,
        (progressValue) => {
          setProgress(progressValue);
        }
      );

      // Update form with extracted data
      updateFormWithOcrData(extractedData, documentType);

      toast.success(`${documentType} processed successfully`, {
        description: "Information has been extracted and filled in the form.",
      });
    } catch (error) {
      toast.error(`Failed to process ${documentType}`, {
        description:
          "There was an error extracting information from your document.",
      });
      console.error("OCR processing error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const updateFormWithOcrData = (data: OcrData, documentType: string) => {
    const filledFields: string[] = [];

    // Update each field and track which ones were filled by OCR
    Object.keys(data).forEach((key) => {
      if (data[key as keyof OcrData] && key in formData) {
        filledFields.push(key);
      }
    });

    setFormData((prev) => ({ ...prev, ...data }));
    setAutoFilledFields((prev) => [...prev, ...filledFields]);

    // Set active tab based on document type
    switch (documentType) {
      case "idCard":
      case "bForm":
        setActiveTab("personal");
        break;
      case "domicile":
        setActiveTab("personal");
        break;
      case "matricResult":
      case "fscResult":
        setActiveTab("academic");
        break;
      default:
        // Keep current tab
        break;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitForm = async () => {
    try {
      setIsSubmitting(true);

      // Add timestamp
      const dataToSubmit = {
        ...formData,
        submitted_at: new Date().toISOString(),
      };

      // Save to Firebase
      const studentId = await saveToFirebase("students", dataToSubmit);

      toast.success("Application submitted successfully", {
        description: `Your application has been submitted with reference ID: ${studentId}`,
      });

      // Reset form after successful submission
      setFormData(initialFormState);
      setAutoFilledFields([]);
      setSelectedFile(null);
      setShowPreview(false);
    } catch (error: any) {
      toast.error("Failed to submit application", {
        description:
          error.message ||
          "There was an error submitting your application. Please try again.",
      });
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="glass-card card-gradient mb-8">
        <div className="flex items-center mb-6">
          <GraduationCap className="h-8 w-8 text-university-700 mr-3" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              NUML AdmitEase
            </h1>
            <p className="text-sm text-gray-600">
              Streamlined Admission Application System
            </p>
          </div>
        </div>

        <p className="text-gray-600 mb-6">
          Please fill out the admission form below. You can upload official
          Pakistani documents (CNIC, B-Form, Matriculation/FSc mark sheets,
          etc.) to automatically fill relevant information. All auto-filled
          fields can be edited if needed.
        </p>

        <DocumentUpload
          onFileSelect={handleFileSelect}
          isPending={isProcessing}
        />

        {isProcessing && (
          <OcrProcessing
            isProcessing={isProcessing}
            progress={progress}
            className="mb-8"
          />
        )}

        <form onSubmit={handleSubmit} className="admission-form-container">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-5 w-full mb-8 transition-all duration-300 hover:shadow-md">
              <TabsTrigger
                value="personal"
                className="flex items-center text-xs md:text-sm transition-all duration-300 hover:bg-university-100"
              >
                <BadgeCheck className="h-4 w-4 mr-2" />
                Personal Info
              </TabsTrigger>
              <TabsTrigger
                value="family"
                className="flex items-center text-xs md:text-sm transition-all duration-300 hover:bg-university-100"
              >
                <Home className="h-4 w-4 mr-2" />
                Family Details
              </TabsTrigger>
              <TabsTrigger
                value="academic"
                className="flex items-center text-xs md:text-sm transition-all duration-300 hover:bg-university-100"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Academic Info
              </TabsTrigger>
              <TabsTrigger
                value="program"
                className="flex items-center text-xs md:text-sm transition-all duration-300 hover:bg-university-100"
              >
                <FileCheck className="h-4 w-4 mr-2" />
                Program Selection
              </TabsTrigger>
              <TabsTrigger
                value="additional"
                className="flex items-center text-xs md:text-sm transition-all duration-300 hover:bg-university-100"
              >
                <FileText className="h-4 w-4 mr-2" />
                Additional Info
              </TabsTrigger>
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="personal" className="mt-0 animate-fade-in">
              <div className="glass-card mb-4 p-4 hover:shadow-md transition-all duration-300">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <BadgeCheck className="h-5 w-5 mr-2 text-university-600" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                  <FormField
                    id="full_name"
                    label="Full Name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                    autoFilled={autoFilledFields.includes("full_name")}
                    readOnly={autoFilledFields.includes("full_name")}
                  />

                  <FormField
                    id="cnic"
                    label="CNIC / B-Form Number"
                    value={formData.cnic}
                    onChange={handleInputChange}
                    placeholder="e.g., 35202-1234567-8"
                    required
                    autoFilled={autoFilledFields.includes("cnic")}
                    readOnly={autoFilledFields.includes("cnic")}
                  />

                  <FormField
                    id="dob"
                    label="Date of Birth"
                    type="date"
                    value={formData.dob}
                    onChange={handleInputChange}
                    required
                    autoFilled={autoFilledFields.includes("dob")}
                    readOnly={autoFilledFields.includes("dob")}
                  />

                  <FormField
                    id="gender"
                    label="Gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    placeholder="Male/Female/Other"
                    required
                    autoFilled={autoFilledFields.includes("gender")}
                    readOnly={autoFilledFields.includes("gender")}
                  />

                  <FormField
                    id="religion"
                    label="Religion"
                    value={formData.religion}
                    onChange={handleInputChange}
                    placeholder="Enter your religion"
                    required
                    autoFilled={autoFilledFields.includes("religion")}
                    readOnly={autoFilledFields.includes("religion")}
                  />

                  <FormField
                    id="marital_status"
                    label="Marital Status"
                    value={formData.marital_status}
                    onChange={handleInputChange}
                    placeholder="Single/Married/Other"
                    required
                    autoFilled={autoFilledFields.includes("marital_status")}
                    readOnly={autoFilledFields.includes("marital_status")}
                  />

                  <FormField
                    id="blood_group"
                    label="Blood Group"
                    value={formData.blood_group}
                    onChange={handleInputChange}
                    placeholder="e.g., A+, B-, O+"
                    autoFilled={autoFilledFields.includes("blood_group")}
                    readOnly={autoFilledFields.includes("blood_group")}
                  />
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData({ ...formData, full_name: e.target.value })
                    }
                  />

                  <input
                    type="text"
                    name="cnic"
                    value={formData.cnic}
                    onChange={(e) =>
                      setFormData({ ...formData, cnic: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="glass-card mb-4 p-4 hover:shadow-md transition-all duration-300">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-university-600" />
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                  <FormField
                    id="phone"
                    label="Contact Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g., +923001234567"
                    required
                    autoFilled={autoFilledFields.includes("phone")}
                    readOnly={autoFilledFields.includes("phone")}
                  />

                  <FormField
                    id="emergency_contact"
                    label="Emergency Contact"
                    value={formData.emergency_contact}
                    onChange={handleInputChange}
                    placeholder="e.g., +923001234567"
                    required
                    autoFilled={autoFilledFields.includes("emergency_contact")}
                    readOnly={autoFilledFields.includes("emergency_contact")}
                  />

                  <FormField
                    id="email"
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    required
                    autoFilled={autoFilledFields.includes("email")}
                    readOnly={autoFilledFields.includes("email")}
                  />

                  <FormField
                    id="nationality"
                    label="Nationality"
                    value={formData.nationality}
                    onChange={handleInputChange}
                    placeholder="Enter nationality"
                    required
                    autoFilled={autoFilledFields.includes("nationality")}
                    readOnly={autoFilledFields.includes("nationality")}
                  />

                  <FormField
                    id="domicile"
                    label="Domicile"
                    value={formData.domicile}
                    onChange={handleInputChange}
                    placeholder="Enter your domicile"
                    required
                    autoFilled={autoFilledFields.includes("domicile")}
                    readOnly={autoFilledFields.includes("domicile")}
                  />

                  <FormField
                    id="city"
                    label="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Enter your city"
                    required
                    autoFilled={autoFilledFields.includes("city")}
                    readOnly={autoFilledFields.includes("city")}
                  />

                  <FormField
                    id="address"
                    label="Current Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter your current address"
                    required
                    autoFilled={autoFilledFields.includes("address")}
                    readOnly={autoFilledFields.includes("address")}
                    className="md:col-span-2"
                  />

                  <FormField
                    id="permanent_address"
                    label="Permanent Address (if different)"
                    value={formData.permanent_address}
                    onChange={handleInputChange}
                    placeholder="Enter your permanent address"
                    autoFilled={autoFilledFields.includes("permanent_address")}
                    readOnly={autoFilledFields.includes("permanent_address")}
                    className="md:col-span-2"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button
                  type="button"
                  onClick={() => setActiveTab("family")}
                  className="glass-button transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center"
                >
                  Next: Family Details
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2 animate-bounce-horizontal"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Button>
              </div>
            </TabsContent>

            {/* Family Details Tab */}
            <TabsContent value="family" className="mt-0 animate-fade-in">
              <div className="glass-card mb-4 p-4 hover:shadow-md transition-all duration-300">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <Home className="h-5 w-5 mr-2 text-university-600" />
                  Family Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                  <FormField
                    id="father_name"
                    label="Father's Name"
                    value={formData.father_name}
                    onChange={handleInputChange}
                    placeholder="Enter father's name"
                    required
                    autoFilled={autoFilledFields.includes("father_name")}
                    readOnly={autoFilledFields.includes("father_name")}
                  />

                  <FormField
                    id="mother_name"
                    label="Mother's Name"
                    value={formData.mother_name}
                    onChange={handleInputChange}
                    placeholder="Enter mother's name"
                    required
                    autoFilled={autoFilledFields.includes("mother_name")}
                    readOnly={autoFilledFields.includes("mother_name")}
                  />
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <Button
                  type="button"
                  onClick={() => setActiveTab("personal")}
                  className="glass-button-secondary transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 animate-bounce-horizontal-reverse"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Back: Personal Information
                </Button>

                <Button
                  type="button"
                  onClick={() => setActiveTab("academic")}
                  className="glass-button transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center"
                >
                  Next: Academic Information
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2 animate-bounce-horizontal"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Button>
              </div>
            </TabsContent>

            {/* Academic Information Tab */}
            <TabsContent value="academic" className="mt-0 animate-fade-in">
              <div className="glass-card mb-4 p-4 hover:shadow-md transition-all duration-300">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <Medal className="h-5 w-5 mr-2 text-university-600" />
                  Matriculation / O-Level Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                  <FormField
                    id="matric_percentage"
                    label="Matric Percentage"
                    value={formData.matric_percentage}
                    onChange={handleInputChange}
                    placeholder="e.g., 85.4"
                    required
                    autoFilled={autoFilledFields.includes("matric_percentage")}
                    readOnly={autoFilledFields.includes("matric_percentage")}
                  />

                  <FormField
                    id="matric_board"
                    label="Board/Institution"
                    value={formData.matric_board}
                    onChange={handleInputChange}
                    placeholder="e.g., Lahore Board"
                    required
                    autoFilled={autoFilledFields.includes("matric_board")}
                    readOnly={autoFilledFields.includes("matric_board")}
                  />

                  <FormField
                    id="matric_passing_year"
                    label="Passing Year"
                    value={formData.matric_passing_year}
                    onChange={handleInputChange}
                    placeholder="e.g., 2020"
                    required
                    autoFilled={autoFilledFields.includes(
                      "matric_passing_year"
                    )}
                    readOnly={autoFilledFields.includes("matric_passing_year")}
                  />

                  <FormField
                    id="matric_roll_number"
                    label="Roll Number"
                    value={formData.matric_roll_number}
                    onChange={handleInputChange}
                    placeholder="Enter roll number"
                    required
                    autoFilled={autoFilledFields.includes("matric_roll_number")}
                    readOnly={autoFilledFields.includes("matric_roll_number")}
                  />

                  <FormField
                    id="matric_subjects"
                    label="Major Subjects"
                    value={formData.matric_subjects}
                    onChange={handleInputChange}
                    placeholder="e.g., Physics, Chemistry, Maths"
                    required
                    autoFilled={autoFilledFields.includes("matric_subjects")}
                    readOnly={autoFilledFields.includes("matric_subjects")}
                    className="md:col-span-2"
                  />
                </div>
              </div>

              <div className="glass-card mb-4 p-4 hover:shadow-md transition-all duration-300">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <Medal className="h-5 w-5 mr-2 text-university-600" />
                  Intermediate / A-Level Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                  <FormField
                    id="fsc_percentage"
                    label="FSc/Intermediate Percentage"
                    value={formData.fsc_percentage}
                    onChange={handleInputChange}
                    placeholder="e.g., 78.9"
                    required
                    autoFilled={autoFilledFields.includes("fsc_percentage")}
                    readOnly={autoFilledFields.includes("fsc_percentage")}
                  />

                  <FormField
                    id="fsc_board"
                    label="Board/Institution"
                    value={formData.fsc_board}
                    onChange={handleInputChange}
                    placeholder="e.g., Lahore Board"
                    required
                    autoFilled={autoFilledFields.includes("fsc_board")}
                    readOnly={autoFilledFields.includes("fsc_board")}
                  />

                  <FormField
                    id="fsc_passing_year"
                    label="Passing Year"
                    value={formData.fsc_passing_year}
                    onChange={handleInputChange}
                    placeholder="e.g., 2022"
                    required
                    autoFilled={autoFilledFields.includes("fsc_passing_year")}
                    readOnly={autoFilledFields.includes("fsc_passing_year")}
                  />

                  <FormField
                    id="fsc_roll_number"
                    label="Roll Number"
                    value={formData.fsc_roll_number}
                    onChange={handleInputChange}
                    placeholder="Enter roll number"
                    required
                    autoFilled={autoFilledFields.includes("fsc_roll_number")}
                    readOnly={autoFilledFields.includes("fsc_roll_number")}
                  />

                  <FormField
                    id="fsc_subjects"
                    label="Major Subjects"
                    value={formData.fsc_subjects}
                    onChange={handleInputChange}
                    placeholder="e.g., Physics, Chemistry, Maths"
                    required
                    autoFilled={autoFilledFields.includes("fsc_subjects")}
                    readOnly={autoFilledFields.includes("fsc_subjects")}
                    className="md:col-span-2"
                  />
                </div>
              </div>

              <div className="glass-card mb-4 p-4 hover:shadow-md transition-all duration-300">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <Medal className="h-5 w-5 mr-2 text-university-600" />
                  Additional Qualifications (if any)
                </h3>
                <div className="grid grid-cols-1 gap-x-6">
                  <FormField
                    id="additional_qualification"
                    label="Additional Qualifications"
                    value={formData.additional_qualification}
                    onChange={handleInputChange}
                    placeholder="e.g., Diploma in Computer Science, Bachelor's Degree"
                    autoFilled={autoFilledFields.includes(
                      "additional_qualification"
                    )}
                    readOnly={autoFilledFields.includes(
                      "additional_qualification"
                    )}
                    className="md:col-span-2"
                  />
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <Button
                  type="button"
                  onClick={() => setActiveTab("family")}
                  className="glass-button-secondary transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 animate-bounce-horizontal-reverse"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Back: Family Details
                </Button>

                <Button
                  type="button"
                  onClick={() => setActiveTab("program")}
                  className="glass-button transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center"
                >
                  Next: Program Selection
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2 animate-bounce-horizontal"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Button>
              </div>
            </TabsContent>

            {/* Program Selection Tab */}
            <TabsContent value="program" className="mt-0 animate-fade-in">
              <div className="glass-card mb-4 p-4 hover:shadow-md transition-all duration-300">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <Building className="h-5 w-5 mr-2 text-university-600" />
                  Program Selection
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                  <FormField
                    id="department"
                    label="Department"
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder="e.g., Computer Science, Languages, Management"
                    required
                    autoFilled={autoFilledFields.includes("department")}
                    readOnly={autoFilledFields.includes("department")}
                  />

                  <FormField
                    id="program"
                    label="Program"
                    value={formData.program}
                    onChange={handleInputChange}
                    placeholder="e.g., Bachelor of Science, Master of Arts"
                    required
                    autoFilled={autoFilledFields.includes("program")}
                    readOnly={autoFilledFields.includes("program")}
                  />

                  <FormField
                    id="campus"
                    label="Campus"
                    value={formData.campus}
                    onChange={handleInputChange}
                    placeholder="e.g., Islamabad, Lahore, Karachi"
                    required
                    autoFilled={autoFilledFields.includes("campus")}
                    readOnly={autoFilledFields.includes("campus")}
                  />

                  <FormField
                    id="study_mode"
                    label="Study Mode"
                    value={formData.study_mode}
                    onChange={handleInputChange}
                    placeholder="e.g., Regular, Weekend, Evening"
                    required
                    autoFilled={autoFilledFields.includes("study_mode")}
                    readOnly={autoFilledFields.includes("study_mode")}
                  />

                  <FormField
                    id="semester"
                    label="Applying for Semester"
                    value={formData.semester}
                    onChange={handleInputChange}
                    placeholder="e.g., Fall 2025, Spring 2026"
                    required
                    autoFilled={autoFilledFields.includes("semester")}
                    readOnly={autoFilledFields.includes("semester")}
                  />
                </div>
              </div>

              <div className="glass-card mb-4 p-4 hover:shadow-md transition-all duration-300">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-university-600" />
                  Financial Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                  <FormField
                    id="fee_payment_method"
                    label="Fee Payment Method"
                    value={formData.fee_payment_method}
                    onChange={handleInputChange}
                    placeholder="e.g., Self, Parents, Scholarship"
                    required
                    autoFilled={autoFilledFields.includes("fee_payment_method")}
                    readOnly={autoFilledFields.includes("fee_payment_method")}
                  />

                  <FormField
                    id="scholarship_applied"
                    label="Applied for Scholarship"
                    value={formData.scholarship_applied}
                    onChange={handleInputChange}
                    placeholder="Yes/No"
                    required
                    autoFilled={autoFilledFields.includes(
                      "scholarship_applied"
                    )}
                    readOnly={autoFilledFields.includes("scholarship_applied")}
                  />

                  <FormField
                    id="need_financial_aid"
                    label="Need Financial Aid"
                    value={formData.need_financial_aid}
                    onChange={handleInputChange}
                    placeholder="Yes/No"
                    required
                    autoFilled={autoFilledFields.includes("need_financial_aid")}
                    readOnly={autoFilledFields.includes("need_financial_aid")}
                  />

                  <FormField
                    id="income_source"
                    label="Source of Income"
                    value={formData.income_source}
                    onChange={handleInputChange}
                    placeholder="e.g., Parent's job, Self-employed"
                    autoFilled={autoFilledFields.includes("income_source")}
                    readOnly={autoFilledFields.includes("income_source")}
                  />

                  <FormField
                    id="monthly_income"
                    label="Monthly Family Income (PKR)"
                    value={formData.monthly_income}
                    onChange={handleInputChange}
                    placeholder="e.g., 80000"
                    autoFilled={autoFilledFields.includes("monthly_income")}
                    readOnly={autoFilledFields.includes("monthly_income")}
                  />
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <Button
                  type="button"
                  onClick={() => setActiveTab("academic")}
                  className="glass-button-secondary transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 animate-bounce-horizontal-reverse"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Back: Academic Information
                </Button>

                <Button
                  type="button"
                  onClick={() => setActiveTab("additional")}
                  className="glass-button transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center"
                >
                  Next: Additional Information
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2 animate-bounce-horizontal"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Button>
              </div>
            </TabsContent>

            {/* Additional Information Tab */}
            <TabsContent value="additional" className="mt-0 animate-fade-in">
              <div className="glass-card mb-4 p-4 hover:shadow-md transition-all duration-300">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <Briefcase className="h-5 w-5 mr-2 text-university-600" />
                  Additional Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                  <FormField
                    id="extra_curricular"
                    label="Extra-Curricular Activities"
                    value={formData.extra_curricular}
                    onChange={handleInputChange}
                    placeholder="e.g., Sports, Music, Debate"
                    autoFilled={autoFilledFields.includes("extra_curricular")}
                    readOnly={autoFilledFields.includes("extra_curricular")}
                    className="md:col-span-2"
                  />

                  <FormField
                    id="disabilities"
                    label="Any Disabilities (if any)"
                    value={formData.disabilities}
                    onChange={handleInputChange}
                    placeholder="Specify if any, or write 'None'"
                    autoFilled={autoFilledFields.includes("disabilities")}
                    readOnly={autoFilledFields.includes("disabilities")}
                    className="md:col-span-2"
                  />

                  <FormField
                    id="languages_known"
                    label="Languages Known"
                    value={formData.languages_known}
                    onChange={handleInputChange}
                    placeholder="e.g., English, Urdu, Punjabi"
                    autoFilled={autoFilledFields.includes("languages_known")}
                    readOnly={autoFilledFields.includes("languages_known")}
                    className="md:col-span-1"
                  />

                  <FormField
                    id="how_did_you_hear"
                    label="How did you hear about NUML?"
                    value={formData.how_did_you_hear}
                    onChange={handleInputChange}
                    placeholder="e.g., Website, Friend, Advertisement"
                    autoFilled={autoFilledFields.includes("how_did_you_hear")}
                    readOnly={autoFilledFields.includes("how_did_you_hear")}
                    className="md:col-span-1"
                  />
                </div>
              </div>

              <div className="glass-card mb-4 p-4 hover:shadow-md transition-all duration-300">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <FileCheck className="h-5 w-5 mr-2 text-university-600" />
                  Declaration
                </h3>
                <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-100 text-gray-700 text-sm transition-all duration-300 hover:shadow-inner">
                  <p>
                    I hereby declare that the information provided in this
                    application is true and correct to the best of my knowledge.
                    I understand that providing false information may result in
                    cancellation of my admission at any stage.
                  </p>
                  <p className="mt-2">
                    I also authorize NUML University to verify any information
                    provided in this application from relevant educational
                    institutions, examination boards, and other organizations.
                  </p>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <Button
                  type="button"
                  onClick={() => setActiveTab("program")}
                  className="glass-button-secondary transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 animate-bounce-horizontal-reverse"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Back: Program Selection
                </Button>

                <Button
                  type="submit"
                  className="glass-button inline-flex items-center transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Submit Application
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </form>
      </div>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <FileCheck className="h-5 w-5 mr-2 text-university-600" />
              Application Preview
            </DialogTitle>
            <DialogDescription>
              Please verify all information before final submission.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 max-h-[60vh] overflow-y-auto py-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800 flex items-center">
                <BadgeCheck className="h-4 w-4 mr-2 text-university-600" />
                Personal Information
              </h3>

              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium">{formData.full_name}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">CNIC / B-Form</p>
                <p className="font-medium">{formData.cnic}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="font-medium">{formData.dob}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p className="font-medium">{formData.gender}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Religion</p>
                <p className="font-medium">{formData.religion}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Marital Status</p>
                <p className="font-medium">{formData.marital_status}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Blood Group</p>
                <p className="font-medium">{formData.blood_group || "N/A"}</p>
              </div>

              <h3 className="font-semibold text-gray-800 flex items-center mt-4">
                <Home className="h-4 w-4 mr-2 text-university-600" />
                Family Information
              </h3>

              <div>
                <p className="text-sm text-gray-500">Father's Name</p>
                <p className="font-medium">{formData.father_name}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Mother's Name</p>
                <p className="font-medium">{formData.mother_name}</p>
              </div>

              <h3 className="font-semibold text-gray-800 flex items-center mt-4">
                <Globe className="h-4 w-4 mr-2 text-university-600" />
                Contact Information
              </h3>

              <div>
                <p className="text-sm text-gray-500">Contact Number</p>
                <p className="font-medium">{formData.phone}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Emergency Contact</p>
                <p className="font-medium">{formData.emergency_contact}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="font-medium">{formData.email}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">{formData.address}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800 flex items-center">
                <BookOpen className="h-4 w-4 mr-2 text-university-600" />
                Academic Information
              </h3>

              <div>
                <p className="text-sm text-gray-500">Matric Percentage</p>
                <p className="font-medium">{formData.matric_percentage}%</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Matric Board</p>
                <p className="font-medium">{formData.matric_board}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">FSc Percentage</p>
                <p className="font-medium">{formData.fsc_percentage}%</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">FSc Board</p>
                <p className="font-medium">{formData.fsc_board}</p>
              </div>

              <h3 className="font-semibold text-gray-800 flex items-center mt-4">
                <Building className="h-4 w-4 mr-2 text-university-600" />
                Program Selection
              </h3>

              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-medium">{formData.department}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Program</p>
                <p className="font-medium">{formData.program}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Campus</p>
                <p className="font-medium">{formData.campus}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Study Mode</p>
                <p className="font-medium">{formData.study_mode}</p>
              </div>

              <h3 className="font-semibold text-gray-800 flex items-center mt-4">
                <CreditCard className="h-4 w-4 mr-2 text-university-600" />
                Financial Information
              </h3>

              <div>
                <p className="text-sm text-gray-500">Fee Payment Method</p>
                <p className="font-medium">{formData.fee_payment_method}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Applied for Scholarship</p>
                <p className="font-medium">{formData.scholarship_applied}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Need Financial Aid</p>
                <p className="font-medium">{formData.need_financial_aid}</p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPreview(false)}
              className="glass-button-secondary"
              disabled={isSubmitting}
            >
              Edit Application
            </Button>
            <Button
              onClick={submitForm}
              className="glass-button inline-flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Confirm & Submit
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdmissionForm;
function setIsSubmitting(arg0: boolean) {
  throw new Error("Function not implemented.");
}
