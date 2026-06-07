import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PenIcon } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2">
            <PenIcon className="h-6 w-6 text-teal-500" />
            <span className="text-xl font-bold">MindJournal</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost">Home</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

          <div className="prose dark:prose-invert max-w-none">
            <p>Last updated: April 17, 2025</p>

            <h2>Introduction</h2>
            <p>
              Welcome to MindJournal. These Terms of Service govern your use of our mental health journaling
              application. By using MindJournal, you agree to these terms.
            </p>

            <h2>Use of the Service</h2>
            <p>
              MindJournal provides a platform for users to create and maintain a personal mental health journal. You are
              responsible for your use of the service and any content you provide, including compliance with applicable
              laws, rules, and regulations.
            </p>

            <h2>Account Registration</h2>
            <p>
              To use certain features of the service, you may need to register for an account. You agree to provide
              accurate information and keep it updated. You are responsible for maintaining the confidentiality of your
              account and password.
            </p>

            <h2>Content and Conduct</h2>
            <p>
              You retain ownership of any content you submit to the service. By submitting content, you grant us a
              license to use, store, and display your content in connection with providing the service.
            </p>
            <p>You agree not to use the service to:</p>
            <ul>
              <li>Violate any applicable law or regulation</li>
              <li>Infringe the rights of others</li>
              <li>Submit content that is unlawful, defamatory, or otherwise objectionable</li>
              <li>Interfere with the operation of the service</li>
              <li>Attempt to gain unauthorized access to the service or systems</li>
            </ul>

            <h2>Termination</h2>
            <p>
              We may terminate or suspend your access to the service at any time, without prior notice or liability, for
              any reason, including if you breach these Terms.
            </p>

            <h2>Disclaimer of Warranties</h2>
            <p>
              The service is provided "as is" without warranties of any kind, either express or implied. We do not
              warrant that the service will be uninterrupted or error-free.
            </p>

            <h2>Limitation of Liability</h2>
            <p>
              In no event shall MindJournal be liable for any indirect, incidental, special, consequential, or punitive
              damages, including loss of profits, data, or goodwill.
            </p>

            <h2>Changes to Terms</h2>
            <p>
              We may modify these Terms at any time. If we make changes, we will provide notice by posting the updated
              terms on this page and updating the "Last updated" date.
            </p>

            <h2>Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us at:</p>
            <p>
              Email: terms@mindjournal.example.com
              <br />
              Address: 123 Mental Health Street, Wellness City, 12345
            </p>
          </div>
        </div>
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-gray-500 md:text-left">
            © 2025 MindJournal. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-sm text-gray-500 underline-offset-4 hover:underline">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-gray-500 underline-offset-4 hover:underline">
              Terms
            </Link>
            <Link href="/contact" className="text-sm text-gray-500 underline-offset-4 hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
