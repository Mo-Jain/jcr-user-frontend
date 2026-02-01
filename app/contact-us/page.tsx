"use client"

import { useState } from "react"
import { Mail, MapPin, Phone, Copy, Check,  Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export default function ContactPage() {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast({
      title: "Phone number copied!",
      description: "The phone number has been copied to your clipboard.",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  const phoneNumber = "+91 79995 51582"
  const emailAddress = "jcrahmedabad@gmail.com"
  const officeAddress = "Ashraya 9, G 104, Chamunda Nagar, New Ranip, Ahmedabad, Gujarat 382470 India"
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(officeAddress)}`

  return (
    <div
      className={`min-h-screen p-4 md:p-8 lg:p-12 pt-20 sm:pt-16 mt-8 bg-background`}
    >
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We&apos;d love to hear from you. Reach out to us through any of the channels below or fill out the contact form.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="space-y-6">
            <Card className="overflow-hidden border-none shadow-lg bg-muted">
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <a href={`mailto:${emailAddress}`} className="text-primary hover:underline">
                        {emailAddress}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Address</h3>
                      <a
                        href={mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {officeAddress}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">Phone</h3>
                      <div className="flex items-center">
                        <span className="mr-2">{phoneNumber}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(phoneNumber)}
                          className="h-8 px-2"
                        >
                          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="font-medium mb-3">Follow Us</h3>
                  <div className="flex space-x-4">
                    <a target="_blank" href="https://www.instagram.com/jain_car_rental" className="bg-primary/10 p-2 rounded-full hover:bg-primary/20 transition-colors">
                      <Instagram className="h-5 w-5 text-primary" />
                    </a>
                    {/* <a href="#" className="bg-primary/10 p-2 rounded-full hover:bg-primary/20 transition-colors">
                      <Facebook className="h-5 w-5 text-primary" />
                    </a>
                    <a href="#" className="bg-primary/10 p-2 rounded-full hover:bg-primary/20 transition-colors">
                      <Twitter className="h-5 w-5 text-primary" />
                    </a>
                    <a href="#" className="bg-primary/10 p-2 rounded-full hover:bg-primary/20 transition-colors">
                      <Linkedin className="h-5 w-5 text-primary" />
                    </a> */}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="overflow-hidden  border-none shadow-lg bg-muted">
              <CardContent className="p-6 ">
                <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Name
                      </label>
                      <Input id="name" placeholder="Your name" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email
                      </label>
                      <Input id="email" type="email" placeholder="Your email" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Subject
                    </label>
                    <Input id="subject" placeholder="Subject of your message" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message
                    </label>
                    <Textarea id="message" placeholder="Your message" className="min-h-[150px]" />
                  </div>
                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mb-12">
          <Card className="overflow-hidden border-none shadow-lg dark:bg-gray-800">
            <CardContent className="p-0">
              <div className="aspect-[16/9] w-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3514.7196542510137!2d72.57509201236613!3d23.08502771929644!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e832a8a3e9c1f%3A0x580dc04c9b54a634!2sAnant%20Sky!5e0!3m2!1sen!2sin!4v1742395797610!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  className="w-full h-full"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-12">
          <Tabs defaultValue="faq">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="faq">FAQs</TabsTrigger>
            </TabsList>
            <TabsContent value="faq" className="mt-6 space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">How quickly do you respond to inquiries?</h3>
                  <p className="text-muted-foreground">
                    We aim to respond to all inquiries within 24 business hours. For urgent matters, please call our
                    office directly.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
          </Tabs>
        </div>
      </div>
    </div>
  )
}

