# PROJECT.md

# Varnam Invites

## Project Vision

Varnam Invites is a premium wedding invitation platform where customers can browse professionally designed digital wedding invitation templates, preview them, customize their details, and purchase a personalized wedding invitation website.

The platform focuses entirely on the customer experience and does not include an admin panel in the initial version.

The website should feel elegant, luxurious, modern, and trustworthy while maintaining excellent performance and usability.

---

# Core User Journey

User visits website

↓

Views Hero Section with Featured Template Carousel

↓

Browses Template Collection

↓

Selects a Template

↓

Previews Template

↓

Customizes Template Details

↓

Reviews Final Invitation

↓

Completes Payment

↓

Receives Personalized Wedding Invitation

---

# Tech Stack

## Frontend

* Next.js 15
* TypeScript
* Tailwind CSS
* Framer Motion

## Backend

* Supabase

## Database

* PostgreSQL (Supabase)

## Payments

* Razorpay

## Deployment

* Vercel

---

# Website Structure

## 1. Home Page (/)

Purpose:

Introduce the brand and guide users toward browsing templates.

---

### Navigation Bar

Elements:

* Varnam Invites Logo
* Home
* Templates
* Contact
* Browse Templates CTA

Behavior:

* Sticky on scroll
* Responsive mobile menu

---

### Hero Section

Layout:

Two-column layout.

#### Left Side

Content Area

Elements:

* Varnam Invites Logo
* Headline
* Supporting Text
* Primary CTA
* Secondary CTA

Example Headline:

Create Beautiful Digital Wedding Invitations

Example Description:

Choose a template, personalize every detail, and share your special day with elegance.

Buttons:

* Browse Templates
* View Demo

---

#### Right Side

Template Showcase Carousel

Purpose:

Show actual invitation templates immediately when the user lands on the page.

Carousel Behavior:

* One active template fully visible
* Previous template partially visible on left
* Next template partially visible on right
* Auto-scroll every 5 seconds
* Smooth Framer Motion transitions
* Swipe support on mobile
* Manual navigation support

Visual Style:

Card-stack effect.

Structure:

[ Previous ] [ Active Template ] [ Next ]

Template Cards:

* High-quality preview image
* Elegant shadows
* Smooth scaling animation

Interactions:

* Click template → Open Preview Page
* Hover animation on desktop

---

### Featured Templates Section

Display:

* Most popular templates
* Grid layout

Each card contains:

* Template Thumbnail
* Template Name
* Price
* Preview Button
* Customize Button

---

### How It Works Section

Step 1:
Choose a Template

Step 2:
Customize Details

Step 3:
Purchase

Step 4:
Share Invitation

---

### Why Choose Us

Features:

* Premium Designs
* Mobile Friendly
* Fast Setup
* Elegant Experience
* Easy Customization

---

### Testimonials

Customer Reviews

---

### FAQ

Frequently Asked Questions

---

### Footer

Links:

* Home
* Templates
* Contact

Social Links

Copyright

---

# 2. Templates Page (/templates)

Purpose:

Allow customers to browse all available invitation templates.

Features:

* Responsive Grid Layout
* Search Templates
* Filter Categories
* Sorting Options

Template Card:

* Thumbnail
* Template Name
* Price
* Preview Button
* Customize Button

Hover Effects:

* Scale animation
* Shadow enhancement

---

# 3. Template Preview Page (/templates/[slug])

Purpose:

Allow customers to experience the invitation before purchasing.

Features:

* Full Interactive Preview
* Mobile Preview Mode
* Desktop Preview Mode
* Preview in Browser

Buttons:

* Customize Template
* Purchase Template

Behavior:

Users should experience the invitation exactly as guests would.

---

# 4. Template Customization Page (/customize/[slug])

Purpose:

Allow customers to personalize invitation content.

---

## Editable Information

### Couple Details

* Groom Name
* Bride Name

### Event Details

* Wedding Date
* Wedding Time
* Venue Name
* Venue Address

### Messages

* Welcome Message
* Invitation Text

### RSVP Information

* Phone Number
* Contact Details

### Media

* Couple Photos

---

## Live Preview

Requirements:

* Real-time updates
* No page refresh
* Responsive display

Changes should instantly appear inside the invitation preview.

---

# 5. Checkout Page (/checkout)

Purpose:

Complete purchase.

Features:

* Order Summary
* Selected Template
* Preview of Customized Details
* Razorpay Integration

Payment Flow:

Customize

↓

Review

↓

Pay

↓

Success Page

---

# 6. Success Page (/success)

Purpose:

Confirm successful purchase.

Display:

* Order Confirmation
* Success Message
* Invitation Access Information
* Support Contact

---

# Design Guidelines

Style:

* Premium
* Elegant
* Minimal
* Luxury Wedding Theme

Visual Characteristics:

* Soft Colors
* Generous White Space
* Smooth Animations
* Modern Typography
* High-End Feel

---

# Animation Guidelines

Use Framer Motion.

Hero Carousel:

* Smooth slide transitions
* Scale active template
* Fade inactive templates

Page Transitions:

* Subtle fades
* Smooth navigation

Buttons:

* Hover animations
* Press interactions

Cards:

* Lift on hover

---

# Performance Requirements

* Lighthouse Score 90+
* Fast Loading
* Mobile Optimized
* SEO Optimized
* Accessibility Compliant

---

# Future Features

Phase 2:

* User Accounts
* Saved Invitations
* Dashboard

Phase 3:

* RSVP Management
* Guest Lists
* QR Code Sharing

Phase 4:

* AI Invitation Content Generator

---

# Success Criteria

A user should be able to:

1. Land on the website
2. Immediately see invitation templates in the hero carousel
3. Browse available templates
4. Preview a template
5. Customize wedding details
6. Purchase the invitation
7. Receive their personalized wedding invitation with minimal friction

The entire journey should take less than 10 minutes for a first-time customer.
