# Untranslated Static Strings — `src/pages/admin`

> **Scan date:** 2025  
> **Total existing translation keys:** 3,220  
> Strings below are hardcoded English text in JSX **not** wrapped in `t()`.

---

## AdminDashboard.tsx
| Line | Context | Hardcoded String |
|------|---------|-----------------|
| 200 | Currency label | `MAD` |
| 219 | Chart fallback | `Chart data unavailable` |
| 246 | Chart fallback (reused) | `Chart data unavailable` |
| 285 | Activity fallback | `Activity unavailable` |
| 326 | Events fallback | `Events unavailable` |
| 340 | Button | `Manage Events` |
| 358 | Button | `Add New Club` |
| 364 | Button | `Create Event` |
| 370 | Button | `Review Applications` |
| 376 | Button | `Send Email Campaign` |
| 382 | Button | `View Reports` |

---

## AdminLogin.tsx
| Line | Context | Hardcoded String |
|------|---------|-----------------|
| 75 | Toast title | `Access Denied` |
| 76 | Toast description | `You do not have admin panel access.` |
| 93 | Toast title | `Login successful` |
| 94 | Toast description | `Welcome back to the admin dashboard!` |
| 101 | Toast title | `Login failed` |

---

## AdminSettings.tsx
| Line | Context | Hardcoded String |
|------|---------|-----------------|
| 100 | Loading state | `Loading…` |
| 105 | Label | `Site Name / Title` |
| 110 | Placeholder | `Your site name` |
| 114 | Label | `Site Description` |
| 120 | Placeholder | `Brief description of your site` |
| 124 | Label | `Contact Email` |
| 131 | Placeholder | `contact@example.com` |
| 133 | Hint | `Full contact details can be edited in Contact Settings.` |
| 176 | Label | `Meta Title` |
| 182 | Placeholder | `Site title for search engines` |
| 185 | Label | `Meta Description` |
| 191 | Placeholder | `Description shown in search results (150–160 chars)` |
| 194 | Dynamic text | `characters / 160` |
| 198 | Label | `Keywords` |
| 203 | Placeholder | `Comma-separated keywords` |
| 207 | Label | `Twitter / X Handle` |
| 212 | Placeholder | `@yourhandle` |
| 236 | CardTitle | `Third-Party Integrations` |
| 239 | CardDescription | `API keys and secrets are managed securely through Replit environment variables — not stored in the database.` |
| 245 | Integration name | `Stripe` |
| 250 | Integration name | `PayPal` |
| 255 | Integration name | `SMTP Email` |
| 260 | Integration name | `CMI Payment Gateway` |

---

## AuthSettings.tsx
| Line | Context | Hardcoded String |
|------|---------|-----------------|
| 67 | Toast title | `Authentication settings saved` |
| 69 | Toast title | `Save failed` |
| 78 | Toast title | `Couldn't load auth settings` |
| 79 | Toast description | `Authentication settings failed to load.` |
| 89 | Card description | `Control how users sign up and log in to the site.` |
| 94 | CardTitle | `User Registration` |
| 95 | CardDescription | `Allow or block new users from creating accounts.` |
| 110 | Label | `Allow New Registrations` |
| 111 | Hint | `When off, only existing users can log in. New sign-ups are blocked.` |
| 124 | Label | `Require Email Verification` |
| 125 | Hint | `New accounts must verify their email before they can log in.` |
| 140 | Heading | `Password Policy` |
| 142 | Hint | `Minimum requirements for user passwords.` |
| 146 | Label | `Minimum Password Length` |
| 156 | Hint | `characters (4 – 32)` |
| 166 | Heading | `Session & Security` |
| 171 | Label | `Session Duration (hours)` |
| 181 | Hint | `hours before users are logged out (1 – 720)` |
| 186 | Label | `Max Login Attempts` |
| 196 | Hint | `failed attempts before account is temporarily locked` |
| 202 | Warning | `Session duration and login attempt lockout are enforced by the server. Changes take effect for new sessions immediately.` |

---

## BookingManagement.tsx
| Line | Context | Hardcoded String |
|------|---------|-----------------|
| 128 | Toast title | `Ticket downloaded` |
| 129 | Toast description | `saved to your downloads folder.` |
| 142 | DialogTitle | `Event Ticket` |
| 169 | Ticket template | `THE JOURNEY` |
| 174 | Ticket template | `ASSOCIATION` |
| 180 | Ticket template | `EVENT TICKET` |
| 185 | Ticket template | `CONFIRMED` |
| 222 | Ticket template | `E V E N T` |
| 239 | Ticket labels | `GUEST NAME`, `ATTENDEES`, `person`, `persons` |
| 240 | Ticket labels | `DATE`, `TIME` |
| 258 | Ticket label | `TOTAL AMOUNT` |
| 267 | Ticket label | `BOOKING REFERENCE` |
| 301 | Ticket footer | `PRESENT THIS TICKET AT THE EVENT ENTRANCE` |
| 480 | Validation message | `Please fill in all required fields` |
| 508 | Toast title | `Error` |
| 527 | Select placeholder | `Select an event` |

---

## CitiesManagement.tsx
| Line | Context | Hardcoded String |
|------|---------|-----------------|
| 130 | Toast title | `Image deleted` |
| 132 | Toast title | `Failed to delete image` |
| 156 | Toast description | `image uploaded` / `images uploaded` |
| 159 | Toast description | `upload failed` / `uploads failed` |
| 178 | Dialog title | `Choose Image` |
| 182 | Dialog description | `Select from built-in city images, your media library, or enter a custom URL.` |
| 218 | Placeholder | `Search images…` |
| 234 | Button | `Uploading…` / `Upload` |
| 267 | Empty state | `No images match your search.` |
| 275 | Loading | `Loading media library…` |
| 291 | Empty state | `Upload Your First Image` |
| 349 | Placeholder | `https://example.com/image.jpg or /uploads/...` |
| 368 | Button | `Clear` |
| 379 | Button | `Use This Image` |
| 403 | Toast title/desc | `File too large` / `Maximum video size is 200 MB.` |
| 415 | Toast title | `Video uploaded successfully` |
| 417 | Toast | `Upload failed` / `Could not upload video.` |
| 431 | Placeholder | `https://example.com/hero.mp4 or upload ↑` |
| 446 | Button | `Uploading video…` |
| 454 | Hint | `Upload an MP4 or WebM file (max 200 MB) or paste a direct video URL.` |
| 488 | Button | `Browse` |
| 498 | Button | `Remove` |

---

## ClubForm.tsx
| Line | Context | Hardcoded String |
|------|---------|-----------------|
| 61 | Toast | `Invalid file` / `Please select an image file.` |
| 65 | Toast | `File too large` / `Image must be under 5 MB.` |
| 82 | Toast title | `Image uploaded successfully` |
| 85 | Toast | `Upload failed` |
| 298 | Toast | `No results` / `Try a different search term.` |
| 307 | Toast | `Search failed` / `Could not reach geocoding service.` |
| 470 | Toast | `Error` / `Failed to load club` |

---

## ClubsManagement.tsx
| Line | Context | Hardcoded String |
|------|---------|-----------------|
| — | Various | Button/table text (see grep results above) |

---

## ClubsPageSettings.tsx
| Line | Context | Hardcoded String |
|------|---------|-----------------|
| 72 | Toast title | `Clubs page settings saved` |
| 74 | Toast title | `Save failed` |
| 114 | Info text | `Hero section (title, subtitle, background image) is managed under…` |
| 129 | CardTitle | `Introduction Section` |
| 130 | CardDescription | `Text shown below the stats bar` |
| 176 | CardTitle | `Call-to-Action Section` |
| 177 | CardDescription | `Bottom banner encouraging new club creation` |

---

## ContactSettings.tsx
| Line | Context | Hardcoded String |
|------|---------|-----------------|
| 268 | Toast title | `Couldn't load contact info` |
| 319 | Placeholder | `Rabat Bouregreg, Morocco` |
| 334 | Toast title | `Couldn't load social links` |
| 417 | Toast title | `Couldn't load page labels` |

---

## ContactSubmissions.tsx
| Line | Context | Hardcoded String |
|------|---------|-----------------|
| 200 | Toast title | `Error` |

---

## EmailCampaigns.tsx
| Line | Context | Hardcoded String |
|------|---------|-----------------|
| 255 | Toast title | `SMTP settings saved` |
| 257 | Toast title | `Save failed` |
| 265 | Toast title | `Enter a test email address` |
| 276 | Toast title | `Test email sent!` |
| 279 | Toast | `Test failed` |
| 288 | Toast title | `Fill in all fields` |
| 299 | Toast title | `Email sent!` |
| 303 | Toast | `Send failed` |

---

## EventsManagement.tsx
| Line | Context | Hardcoded String |
|------|---------|-----------------|
| 528 | Placeholder | `Enter event title` |
| 597 | Placeholder | `Event location` |
| 863 | Placeholder | `Translated location` |
| 881 | Placeholder | `One highlight per line` |

---

## ExpertsAdmin.tsx
| Line | Context | Hardcoded String |
|------|---------|-----------------|
| 214 | Button | `Search` |
| 237 | Empty state title | `No experts yet` |
| 248 | TableHead | `Experience` |
| 249 | TableHead | `Available` |

---

## FocusAreasManagement.tsx
| Line | Context | Hardcoded String |
|------|---------|-----------------|
| 327 | Select placeholder | `Status` |

---

## GalleryManagement.tsx
| Line | Context | Hardcoded String |
|------|---------|-----------------|
| 384 | Toast title | `Gallery item created` |
| 387 | Toast title | `Failed to create item` |
| 394 | Toast title | `Gallery item updated` |
| 397 | Toast title | `Failed to update item` |
| 405 | Toast title | `Title and image are required` |
| 607 | Badge | `360° Tour` |

---

## HeroSettings.tsx
| Line | Context | Hardcoded String |
|------|---------|-----------------|
| 317 | Button title attr | `Remove this title` |

---

## JoinUsConfig.tsx
| Line | Context | Hardcoded String |
|------|---------|-----------------|
| 11 | CardTitle | `Form Settings` |

---

## LandingManagement.tsx
| Line | Context | Hardcoded String |
|------|---------|-----------------|
| 156 | Info banner | `You have unsaved changes — click Save Changes to apply them to the live site.` |

---

## LegalPagesSettings.tsx
| Line | Context | Hardcoded String |
|------|---------|-----------------|
| 92 | Toast title | `Saved` |
| 95 | Toast title | `Save failed` |
| 136 | Label | `Page Title` |

---

## MediaLibrary.tsx
| Line | Context | Hardcoded String |
|------|---------|-----------------|
| 107 | Button title attr | `Copy URL` |
| 110 | Button title attr | `Delete` |

---

## NavbarSettings.tsx
| Line | Context | Hardcoded String |
|------|---------|-----------------|
| 140 | Placeholder | `Link Label` |
| 188 | Select placeholder | `Select dropdown display type` |
| 191 | SelectItem | `Simple List` |
| 192 | SelectItem | `List with Images` |
| 230 | Placeholder | `Item Label` |
| 276 | Placeholder | `Brief description` |
| 356 | DialogDescription | `Choose an image from your media library to use as the logo` |
| 693 | Placeholder | `Your Brand Name` |
| 863 | Placeholder | `EN, FR, AR` |
| 889 | Label | `Background Color` |
| 906 | Label | `Text Color` |
| 923 | Label | `Hover Color` |

---

## PageHeroSettings.tsx
| Line | Context | Hardcoded String |
|------|---------|-----------------|
| 110 | Toast (save success) | (see file) |
| 136 | Toast (error) | (see file) |
| 141 | Toast (error) | (see file) |
| 286 | Info text | `When Background Type is set to Video, all city detail pages will show the configured video instead of the city's own photo.` |

---

## PaymentSettings.tsx
| Line | Context | Hardcoded String |
|------|---------|-----------------|
| 341 | Placeholder | `Your secret CMI store key` |
| 457 | Warning text | `CMI is enabled but Merchant ID and/or Store Key are missing.` |

---

## ProjectsAdmin.tsx
| Line | Context | Hardcoded String |
|------|---------|-----------------|
| 159 | Button | `Search` |
| 184 | Empty state title | `No projects yet` |
| 196 | TableHead | `Participants` |
| 197 | TableHead | `Featured` |

---

## SystemMonitoring.tsx
| Line | Context | Hardcoded String |
|------|---------|-----------------|
| 12 | CardTitle | `Server Status` |
| 15 | Placeholder text | `System monitoring interface will be implemented here` |
| 20 | CardTitle | `Database Status` |
| 23 | Placeholder text | `Database monitoring will be shown here` |

---

## ThemeCustomization.tsx
| Line | Context | Hardcoded String |
|------|---------|-----------------|
| 11 | CardTitle | `Theme Settings` |

---

## UserRolesManagement.tsx
| Line | Context | Hardcoded String |
|------|---------|-----------------|
| 288 | Toast title | `Role updated successfully` |
| 294 | Toast | `Failed to update role` |

---

## VolunteerOpportunitiesAdmin.tsx
| Line | Context | Hardcoded String |
|------|---------|-----------------|
| 89 | Toast title | `Opportunity updated` / `Opportunity created` |
| 92 | Toast title | `Error` |
| 102 | Toast title | `Deleted` |
| 148 | Button | `Search` |
| 180 | TableHead | `Participants` |

---

## VolunteerPostsAdmin.tsx
| Line | Context | Hardcoded String |
|------|---------|-----------------|
| 98 | Toast title | `Post updated` / `Post created` |
| 101 | Toast title | `Error` |
| 111 | Toast title | `Deleted` |
| 156 | Button | `Search` |
| 190 | TableHead | `Deadline` |

---

## WorkOffersAdmin.tsx
| Line | Context | Hardcoded String |
|------|---------|-----------------|
| 92 | Toast title | `Offer updated` / `Offer created` |
| 95 | Toast title | `Error` |
| 105 | Toast title | `Deleted` |
| 149 | Button | `Search` |
| 184 | TableHead | `Salary` |

---

## Summary by Category

| Category | Count (approx.) |
|----------|----------------|
| Toast messages (title/description) | ~55 |
| Labels & headings | ~30 |
| Placeholders | ~25 |
| Button text | ~20 |
| Card titles & descriptions | ~20 |
| Table headers | ~8 |
| Empty state / fallback text | ~10 |
| Ticket template strings | ~12 |
| Info / hint / warning text | ~15 |
| **Total untranslated strings** | **~195** |

---

## Suggested Next Steps

1. Add all missing keys to `src/i18n/locales/en.json` under an `admin.*` namespace
2. Use the **Translations Management** admin page to auto-translate to FR, AR, ES
3. Replace each hardcoded string with `t('admin.keyName')`
