"use client";

import * as React from "react";
import { Button } from "@src/components/ui/button";
import { Input } from "@src/components/ui/input";
import { Textarea } from "@src/components/ui/textarea";
import { ContactFormData, ContactFormError } from "@src/api/contactApi";

interface ContactFormProps {
  onSubmit: (formData: ContactFormData) => Promise<void>;
  errors?: ContactFormError | null;
}

export default function ContactForm({ onSubmit, errors }: ContactFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [message, setMessage] = React.useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);

    try {
      await onSubmit({
        name,
        email,
        subject,
        message,
      });
    } catch (error) {
      console.error("Contact form submission failed:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const renderFieldError = (fieldErrors?: string[]) => {
    if (!fieldErrors || fieldErrors.length === 0) return null;

    return (
      <div className="text-destructive text-sm mt-1">
        {fieldErrors.map((error, index) => (
          <p key={index}>{error}</p>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-5">
      {errors?.non_field_errors && (
        <div className="text-destructive px-4 py-3 rounded-md text-sm border border-destructive/20 bg-destructive/10">
          {errors.non_field_errors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1">
          <Input
            id="name"
            placeholder="Your Name"
            type="text"
            autoCapitalize="none"
            autoCorrect="off"
            disabled={isLoading}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {renderFieldError(errors?.name)}
        </div>

        <div className="space-y-1">
          <Input
            id="email"
            placeholder="Your Email"
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            disabled={isLoading}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {renderFieldError(errors?.email)}
        </div>

        <div className="space-y-1">
          <Input
            id="subject"
            placeholder="Subject"
            type="text"
            autoCapitalize="none"
            autoCorrect="off"
            disabled={isLoading}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            maxLength={100}
          />
          {renderFieldError(errors?.subject)}
        </div>

        <div className="space-y-1">
          <Textarea
            id="message"
            placeholder="Your Message"
            disabled={isLoading}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="min-h-[150px]"
            maxLength={1000}
          />
          {renderFieldError(errors?.message)}
        </div>

        <Button disabled={isLoading} type="submit" className="w-full">
          {isLoading && (
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
          )}
          Send Message
        </Button>
      </form>
    </div>
  );
}
