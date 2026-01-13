"use client";

import { useState } from "react";
import ContactForm from "@src/app/contact/components/ContactForm";
import {
  sendContactForm,
  ContactFormData,
  ContactFormError,
} from "@src/api/contactApi";
import { CheckCircle, Mail } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@src/components/ui/alert";
import Link from "next/link";
import { Routes } from "@src/constants/routes";

export default function ContactPage() {
  const [errors, setErrors] = useState<ContactFormError | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleContactSubmit = async (formData: ContactFormData) => {
    try {
      setErrors(null);
      const result = await sendContactForm(formData);

      if (result.success) {
        setIsSuccess(true);
      } else if (result.error) {
        setErrors(result.error);
      }
    } catch (error) {
      console.error("Contact form submission failed:", error);
      setErrors({
        non_field_errors: [
          "An unexpected error occurred. Please try again later.",
        ],
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
      {/* Hero Section */}
      <div className="max-w-3xl mx-auto mb-8 md:mb-8 text-center">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-normal mb-4 leading-tight">
          Contact Us
        </h1>

        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
          Have a question or need assistance? Get in touch with our team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {/* Contact Form or Success Message */}
        <div className="md:col-span-2 bg-white rounded-lg p-6 md:p-8 shadow-md border border-gray-200">
          {isSuccess ? (
            <Alert className="border-green-200 bg-green-50 p-6">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                  <AlertTitle className="text-green-800 font-medium text-lg">
                    Message sent successfully!
                  </AlertTitle>
                </div>

                <AlertDescription className="text-green-700 mt-2">
                  <p>Thank you for reaching out to us.</p>
                  <p className="mt-2">
                    We&apos;ve received your message and will get back to you as
                    soon as possible.
                  </p>
                </AlertDescription>
              </div>
            </Alert>
          ) : (
            <ContactForm onSubmit={handleContactSubmit} errors={errors} />
          )}
        </div>

        {/* Contact Info & Quick Links */}
        <div className="space-y-6">
          {/* Contact Info */}
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <h2 className="text-lg font-medium mb-4">Contact Information</h2>
            <h3 className="text-sm text-muted-foreground mb-4">
              Alternatively, you can email us directly at:
            </h3>

            <div className="space-y-3">
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-primary mr-3 mt-0.5" />
                <div>
                  <a
                    href="mailto:support@tagandtake.com"
                    className="text-primary hover:underline"
                  >
                    help@tagandtake.com
                  </a>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                <br></br>
                We aim to respond within 24 hours
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <h2 className="text-lg font-medium mb-4">Quick Links</h2>
            <ul className="space-y-3">
              <li>
                <Link
                  href={Routes.HOW_IT_WORKS}
                  className="text-primary hover:underline flex items-center"
                >
                  <span className="mr-2">→</span> How it works
                </Link>
              </li>
              <li>
                <Link
                  href={`${Routes.HOW_IT_WORKS}#faq`}
                  className="text-primary hover:underline flex items-center"
                >
                  <span className="mr-2">→</span> FAQs
                </Link>
              </li>
              <li>
                <Link
                  href={Routes.STORES.ROOT}
                  className="text-primary hover:underline flex items-center"
                >
                  <span className="mr-2">→</span> Find a store
                </Link>
              </li>
              <li>
                <Link
                  href={Routes.SIGNUP.MEMBER}
                  className="text-primary hover:underline flex items-center"
                >
                  <span className="mr-2">→</span> Create an account
                </Link>
              </li>
              <li>
                <Link
                  href={Routes.SIGNUP.STORE}
                  className="text-primary hover:underline flex items-center"
                >
                  <span className="mr-2">→</span> Become a host
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
