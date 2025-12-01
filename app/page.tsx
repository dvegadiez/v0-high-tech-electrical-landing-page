"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { WhatsAppButton } from "@/components/whatsapp-button"

export default function HomePage() {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    serviceType: "",
    message: "",
  })

  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [validationError, setValidationError] = useState<string | null>(null)
  const timerRef = useRef<number | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const [isNavVisible, setIsNavVisible] = useState(true)
  const lastScrollY = useRef(0)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    // Disable scroll-based navbar hiding when mobile menu is open
    if (isMobileMenuOpen) {
      setIsNavVisible(true)
      return
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY < 10) {
        setIsNavVisible(true)
      } else if (currentScrollY > lastScrollY.current) {
        // Scrolling down
        setIsNavVisible(false)
      } else {
        // Scrolling up
        setIsNavVisible(true)
      }

      lastScrollY.current = currentScrollY
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [isMobileMenuOpen])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener("click", handleClickOutside)
    }

    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [isMobileMenuOpen])

  const services = [
    {
      title: "Residential Electrical",
      description: "Complete electrical services for your home, from repairs to full rewiring projects.",
      icon: "🏠",
    },
    {
      title: "Commercial Electrical",
      description: "Professional electrical solutions for businesses, offices, and commercial properties.",
      icon: "🏢",
    },
    {
      title: "Panel Upgrades",
      description: "Upgrade your electrical panel to meet modern power demands safely and efficiently.",
      icon: "⚡",
    },
    {
      title: "Lighting Installation",
      description:
        "Interior and exterior lighting, recessed lights, security lights and energy-efficient LED solutions.",
      icon: "💡",
    },
    {
      title: "Troubleshooting & Repairs",
      description: "Fast and reliable electrical troubleshooting and repair services.",
      icon: "🔧",
    },
    {
      title: "EV Charger Installation",
      description: "Professional installation of electric vehicle charging stations at your property.",
      icon: "🔌",
    },
  ]

  const benefits = [
    {
      title: "Licensed & Insured",
      description:
        "Fully licensed electrical contractor with comprehensive insurance coverage for your peace of mind. We follow all local electrical codes and safety standards to protect your home or business.",
    },
    {
      title: "Clear Communication",
      description: "We keep you informed every step of the way with transparent pricing and timelines.",
    },
    {
      title: "On-Time & Reliable",
      description: "We respect your valued time and show up when we say we will, with professional, clean work.",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      company: "Homeowner",
      text: "High Tech Electrical did an amazing job upgrading our electrical panel. Professional, efficient, and very knowledgeable. Highly recommend!",
    },
    {
      name: "Mike Chen",
      company: "Chen's Restaurant",
      text: "We needed emergency electrical repairs and they responded immediately. Fixed the issue quickly and at a fair price. Great service!",
    },
    {
      name: "Emily Rodriguez",
      company: "Homeowner",
      text: "Had an EV charger installed in my garage. The team was punctual, clean, and the installation was flawless. Very happy with the results!",
    },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // reset validation error
    setValidationError(null)

    // validation (client-side) - all fields required
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      setValidationError('Please fill in name, email and message.')
      setStatus('error')
      return
    }

    // basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(contactForm.email)) {
      setValidationError('Please enter a valid email address.')
      setStatus('error')
      return
    }

    setStatus('sending')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactForm.name,
          email: contactForm.email,
          phone: contactForm.phone,
          serviceType: contactForm.serviceType,
          message: contactForm.message,
        }),
      })

      if (res.ok) {
        setValidationError(null)
        setStatus('success')
        setContactForm({ name: '', email: '', phone: '', serviceType: '', message: '' })
      } else {
        const text = await res.text()
        setValidationError(text || 'Server error while sending message')
        setStatus('error')
        console.error('Contact API error:', text)
      }
    } catch (err) {
      setStatus('error')
      console.error('Contact submit error:', err)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value,
    })
  }

  // Auto-hide success/error messages after a short delay
  useEffect(() => {
    // clear previous timer
    if (timerRef.current) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }

    if (status === 'success') {
      timerRef.current = window.setTimeout(() => {
        setStatus('idle')
        setValidationError(null)
        timerRef.current = null
      }, 6000)
    } else if (status === 'error' || validationError) {
      timerRef.current = window.setTimeout(() => {
        setStatus('idle')
        setValidationError(null)
        timerRef.current = null
      }, 8000)
    }

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [status, validationError])

  const scrollToSection = async (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (!element) return

    // If on mobile and the menu is open, close it first so layout/height stabilizes
    const isMobile = window.innerWidth < 768
    if (isMobile && isMobileMenuOpen) {
      setIsMobileMenuOpen(false)
      // wait a couple of frames for the DOM/layout to update after closing the menu
      await new Promise((resolve) => requestAnimationFrame(() => resolve(null)))
      await new Promise((resolve) => requestAnimationFrame(() => resolve(null)))
    }

    // Measure header/nav height and safe-area to compute precise scroll target
    const navHeight = navRef.current ? navRef.current.getBoundingClientRect().height : 0
    const rootStyles = getComputedStyle(document.documentElement)
    const safeAreaVal = rootStyles.getPropertyValue('--safe-area-inset-top') || '0px'
    const safeArea = parseFloat(safeAreaVal) || 0
    const viewportOffset = (window.visualViewport && typeof window.visualViewport.offsetTop === 'number') ? window.visualViewport.offsetTop : 0

    const top = element.getBoundingClientRect().top + window.scrollY - navHeight - safeArea - viewportOffset
    window.scrollTo({ top: Math.max(0, Math.round(top)), behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-white">
      <nav
        ref={navRef}
        className={`bg-white border-b border-slate-200 py-4 px-4 sticky top-0 z-40 shadow-sm transition-transform duration-300 ${
          isNavVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="High Tech Electrical Logo" className="h-12 w-auto" />
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => scrollToSection("services")}
              className="text-slate-700 hover:text-yellow-600 font-medium transition-colors"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection("benefits")}
              className="text-slate-700 hover:text-yellow-600 font-medium transition-colors"
            >
              Benefits
            </button>
            <button
              onClick={() => scrollToSection("projects")}
              className="text-slate-700 hover:text-yellow-600 font-medium transition-colors"
            >
              Projects
            </button>
            <button
              onClick={() => scrollToSection("testimonials")}
              className="text-slate-700 hover:text-yellow-600 font-medium transition-colors"
            >
              Testimonials
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-slate-900 px-4 py-2 rounded-md hover:bg-yellow-500 font-semibold transition-colors bg-yellow-400"
            >
              Contact
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
            className="md:hidden flex flex-col gap-1.5 p-2"
          >
            <span
              className={`block w-6 h-0.5 bg-slate-700 transition-all duration-300 ${
                isMobileMenuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-slate-700 transition-all duration-300 ${
                isMobileMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-slate-700 transition-all duration-300 ${
                isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-slate-200">
            <div className="flex flex-col gap-3 pt-4">
              <button
                onClick={() => {
                  scrollToSection("services")
                  setIsMobileMenuOpen(false)
                }}
                className="text-slate-700 hover:text-yellow-600 font-medium transition-colors text-left py-2 px-2"
              >
                Services
              </button>
              <button
                onClick={() => {
                  scrollToSection("benefits")
                  setIsMobileMenuOpen(false)
                }}
                className="text-slate-700 hover:text-yellow-600 font-medium transition-colors text-left py-2 px-2"
              >
                Benefits
              </button>
              <button
                onClick={() => {
                  scrollToSection("projects")
                  setIsMobileMenuOpen(false)
                }}
                className="text-slate-700 hover:text-yellow-600 font-medium transition-colors text-left py-2 px-2"
              >
                Projects
              </button>
              <button
                onClick={() => {
                  scrollToSection("testimonials")
                  setIsMobileMenuOpen(false)
                }}
                className="text-slate-700 hover:text-yellow-600 font-medium transition-colors text-left py-2 px-2"
              >
                Testimonials
              </button>
              <button
                onClick={() => {
                  scrollToSection("contact")
                  setIsMobileMenuOpen(false)
                }}
                className="text-slate-900 px-4 py-2 rounded-md hover:bg-yellow-500 font-semibold transition-colors bg-yellow-400 w-full"
              >
                Contact
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl">
            <h1 className="md:text-6xl font-bold mb-6 text-balance text-4xl">Comprehensive Electrical Solutions</h1>
            <p className="text-xl md:text-2xl mb-8 text-slate-200 text-pretty">
              High Tech Electrical is a licensed and insured residential and commercial electrical contractor providing
              safe, code-compliant installations and fast repairs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={() => scrollToSection("contact")} size="lg" className="text-slate-900 hover:bg-yellow-500 font-semibold text-lg bg-yellow-400">
                Request a Free Estimate
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
                Call now (305) 813-9051
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose High Tech Electrical?</h2>
          <p className="text-slate-200 text-center mb-10 max-w-3xl mx-auto text-xl">
            With over 15 years of hands-on experience, our priority is to deliver high-quality, reliable electrical
            solutions for every project.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <h3 className="text-2xl font-semibold mb-3 text-yellow-400">{benefit.title}</h3>
                <p className="text-slate-200">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="projects" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Recent Projects</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="aspect-video bg-slate-200 rounded-lg overflow-hidden">
                <img
                  src={`/electrical-project-${item}.png?height=300&width=400&query=electrical+project+${item}`}
                  alt={`Project ${item}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">What Our Clients Say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <p className="text-muted-foreground mb-4 italic">{`"${testimonial.text}"`}</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl font-bold mb-6">Get In Touch</h2>
              <p className="text-slate-200 mb-8">
                Ready to start your electrical project? Contact us today for a free consultation and quote.
              </p>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-yellow-400 mb-1">Phone</h3>
                  <p className="text-slate-200">(305) 813-9051</p>
                </div>
                <div>
                  <h3 className="font-semibold text-yellow-400 mb-1">Email</h3>
                  <p className="text-slate-200">contact@htelectrical.us</p>
                </div>
                <div>
                  <h3 className="font-semibold text-yellow-400 mb-1">Hours</h3>
                  <p className="text-slate-200">Mon-Fri: 7:00 AM - 6:00 PM</p>
                  <p className="text-slate-200">Sat: 8:00 AM - 4:00 PM</p>
                </div>
              </div>
            </div>
            <div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    name="name"
                    placeholder="Your Name"
                    value={contactForm.name}
                    onChange={handleInputChange}
                    required
                    className="bg-white text-slate-900"
                  />
                </div>
                <div>
                  <Input
                    name="email"
                    type="email"
                    placeholder="Your Email"
                    value={contactForm.email}
                    onChange={handleInputChange}
                    required
                    className="bg-white text-slate-900"
                  />
                </div>
                <div>
                  <Input
                    name="phone"
                    type="tel"
                    placeholder="Your Phone"
                    value={contactForm.phone}
                    onChange={handleInputChange}
                    required
                    className="bg-white text-slate-900"
                  />
                </div>
                <div>
                  <select
                    name="serviceType"
                    value={contactForm.serviceType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 rounded-md border bg-white text-slate-900"
                  >
                    <option value="">Select Service Type</option>
                    <option value="residential">Residential Electrical</option>
                    <option value="commercial">Commercial Electrical</option>
                    <option value="panel">Panel Upgrades</option>
                    <option value="lighting">Lighting Installation</option>
                    <option value="repair">Troubleshooting & Repairs</option>
                    <option value="ev">EV Charger Installation</option>
                  </select>
                </div>
                <div>
                  <Textarea
                    name="message"
                    placeholder="Tell us about your project..."
                    value={contactForm.message}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="bg-white text-slate-900"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-yellow-400 text-slate-900 hover:bg-yellow-500 font-semibold"
                >
                  {status === 'sending' ? 'Sending...' : 'Send Message'}
                </Button>
                {status === 'success' && (
                  <p className="text-green-400 mt-2">Message sent. Thank you — we will get in touch with you soon.</p>
                )}
                {validationError && (
                  <p className="text-red-400 mt-2">{validationError}</p>
                )}
                {status === 'error' && !validationError && (
                  <p className="text-red-400 mt-2">Error sending your message. Please try again later.</p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white text-slate-600 py-8 px-4 border-t border-slate-200">
        <div className="max-w-6xl mx-auto text-center">
          <p>&copy; 2025 High Tech Electrical. All rights reserved.</p>
          <p className="mt-2">Licensed & Insured</p>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <WhatsAppButton />
    </div>
  )
}
