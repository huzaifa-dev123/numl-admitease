import React from "react";
import AdmissionForm from "../components/AdmissionForm";
import { GraduationCap, Sparkles, Globe, BookOpen, Zap } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 bg-gradient-to-br from-gray-50 to-blue-100">
      <header className="max-w-5xl mx-auto mb-12">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center mb-4 sm:mb-0">
            <div className="bg-white/70 p-3 rounded-full">
              <GraduationCap className="h-10 w-10 text-university-700" />
            </div>
            <div className="ml-3">
              <h1 className="text-2xl font-bold text-gray-800">
                NUML AdmitEase
              </h1>
              <p className="text-sm text-gray-600">
                National University of Modern Languages
              </p>
            </div>
          </div>

          <div className="glass flex items-center space-x-4 px-4 py-2 rounded-full">
            <Sparkles className="h-4 w-4 text-university-600 animate-pulse-slow" />
            <span className="text-sm font-medium text-gray-800">
              Powered by OCR Technology
            </span>
          </div>
        </div>

        <div className="mt-8 glass-card card-gradient">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            <div className="flex flex-col items-center text-center space-y-2 group">
              <div className="p-3 bg-university-100/50 rounded-full group-hover:bg-university-200/70 transition-all duration-300">
                <Globe className="h-8 w-8 text-university-700" />
              </div>
              <h3 className="font-semibold text-gray-800">
                International Recognition
              </h3>
              <p className="text-sm text-gray-600">
                Globally recognized degrees and accreditations
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-2 group">
              <div className="p-3 bg-university-100/50 rounded-full group-hover:bg-university-200/70 transition-all duration-300">
                <BookOpen className="h-8 w-8 text-university-700" />
              </div>
              <h3 className="font-semibold text-gray-800">Modern Curriculum</h3>
              <p className="text-sm text-gray-600">
                Industry-aligned courses with practical focus
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-2 group">
              <div className="p-3 bg-university-100/50 rounded-full group-hover:bg-university-200/70 transition-all duration-300">
                <Zap className="h-8 w-8 text-university-700" />
              </div>
              <h3 className="font-semibold text-gray-800">
                Streamlined Admissions
              </h3>
              <p className="text-sm text-gray-600">
                Fast document processing with intelligent OCR technology
              </p>
            </div>
          </div>
        </div>
      </header>

      <main>
        <AdmissionForm />
      </main>

      <footer className="mt-16 text-center">
        <div className="glass-card card-gradient max-w-5xl mx-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mb-8">
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Contact Us</h3>
              <p className="text-sm text-gray-600">H-9, Islamabad, Pakistan</p>
              <p className="text-sm text-gray-600">admissions@numl.edu.pk</p>
              <p className="text-sm text-gray-600">+92-51-9265100</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Useful Links</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="hover:text-university-700 transition-colors">
                  Academic Calendar
                </li>
                <li className="hover:text-university-700 transition-colors">
                  Programs Offered
                </li>
                <li className="hover:text-university-700 transition-colors">
                  Student Handbook
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Campuses</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="hover:text-university-700 transition-colors">
                  Islamabad (Main Campus)
                </li>
                <li className="hover:text-university-700 transition-colors">
                  Lahore Campus
                </li>
                <li className="hover:text-university-700 transition-colors">
                  Karachi Campus
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200/50 text-sm text-gray-500">
            <p>© 2025 NUML AdmitEase. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
