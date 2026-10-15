# Manual Testing Checklist

Use fictitious, non-sensitive input. Do not send mail to the placeholder address. No automated testing framework or test script is used.

Reviewer: [Name] | Date: [Date] | Browser: [Version] | OS: [OS] | Viewport: [Dimensions] | Mode: [Development / Local production]

Record Pass, Fail, or Blocked with notes after completing each section. The initial status of every section is **Not Tested**. Compilation and lint results do not count as manual interaction or device coverage.

## 1. Startup

**Objective:** Run locally without services or credentials.

**Steps:** Run `npm install`, then `npm run dev`. Open the printed URL and inspect browser/terminal messages.

**Expected:** Home, local font, and images render without application errors.

**Status:** Not Tested. **Notes:** [Result]

## 2. Home Page

**Objective:** Review complete content and the interactive hero.

**Steps:** Scroll all sections. Select each hero focus tab and follow its CTA. Move the pointer over the hero, then enable reduced motion and repeat.

**Expected:** Correct focus content and routes; bounded pointer movement, no optional motion with reduced motion, no hydration warnings. Honest demonstration labels remain visible.

**Status:** Not Tested. **Notes:** [Result]

## 3. Desktop Header

**Objective:** Navigate using the sticky header.

**Steps:** Open every main link and Services menu. Close with Escape and by tabbing away. Scroll a detail page.

**Expected:** Valid destinations, visible active/focus states, no obscured content or trapped focus.

**Status:** Not Tested. **Notes:** [Result]

## 4. Mobile Navigation

**Objective:** Review the small-screen modal drawer.

**Steps:** At 390px and 320px, open navigation, Tab/Shift+Tab, press Escape, reopen, dismiss through the close icon/backdrop, and follow a link.

**Expected:** Contained focus, blocked background interaction, reachable links, restored trigger focus, and dismissal after navigation.

**Status:** Not Tested. **Notes:** [Result]

## 5. Theme Switching

**Objective:** Verify light/dark/system preferences.

**Steps:** Select each theme, reload, navigate, and change OS preference in System mode. Inspect browser storage manually.

**Expected:** Consistent theme without layout changes. Only `pg-theme` is stored by the app. Blocked storage does not prevent rendering.

**Status:** Not Tested. **Notes:** [Result]

## 6. About

**Objective:** Review profile integrity.

**Steps:** Visit About, Experience, Education, Certifications, and Speaking. Inspect placeholders and subnavigation.

**Expected:** No fabricated titles, dates, institutions, qualifications, or awards; all links resolve.

**Status:** Not Tested. **Notes:** [Result]

## 7. Services

**Objective:** Review all ten services and category browsing.

**Steps:** Switch each home service tab using pointer, arrow keys, Home, and End. Visit all service details from home and Services.

**Expected:** Selected panels match their category, all ten services remain reachable, focus is visible, and content does not overlap or shift excessively.

**Status:** Not Tested. **Notes:** [Result]

## 8. Solutions

**Objective:** Review six audience-specific paths.

**Steps:** Open every solution and its related service/inquiry links.

**Expected:** Audience-appropriate needs and valid destinations.

**Status:** Not Tested. **Notes:** [Result]

## 9. Portfolio Filters

**Objective:** Check combined local filtering.

**Steps:** Search mixed-case terms; combine category, service, industry, and technology choices. Enter an unmatched term, then reset.

**Expected:** Results match every criterion; counts update, empty states are useful, and reset restores the list.

**Status:** Not Tested. **Notes:** [Result]

## 10. Project Details

**Objective:** Review complete project narratives.

**Steps:** Open each project, inspect its label, sections, image, anchors, and related links.

**Expected:** Clear concept/learning/prototype/personal labels; no invented outcomes. Anchors remain visible below the sticky header.

**Status:** Not Tested. **Notes:** [Result]

## 11. Case Studies

**Objective:** Distinguish hypothetical cases from client engagements.

**Steps:** Review each study's disclosure, narrative, future improvements, and related services.

**Expected:** Explicit demonstration status without implied hidden customers or fabricated results.

**Status:** Not Tested. **Notes:** [Result]

## 12. Training

**Objective:** Review course and workshop journeys.

**Steps:** Visit training, course filters/details, workshops, and corporate training. Inspect curriculum, prerequisites, resources, FAQs, and inquiry links.

**Expected:** Complete sample outlines, no invented certification, enrollment, payment, or availability guarantee.

**Status:** Not Tested. **Notes:** [Result]

## 13. Events

**Objective:** Review event states and details.

**Steps:** Use upcoming/past/type filters. Open every detail and inspect schedule placeholders, agenda, mode, resources, and inquiry CTA.

**Expected:** Samples remain clearly unconfirmed; no registration or broken recording link.

**Status:** Not Tested. **Notes:** [Result]

## 14. Blog Filters

**Objective:** Explore writing by search/category/tag.

**Steps:** Combine filters, reset, and visit populated and empty category pages. Follow breadcrumbs.

**Expected:** Correct matches and useful empty states; no missing intermediate category breadcrumb link.

**Status:** Not Tested. **Notes:** [Result]

## 15. Article Details

**Objective:** Check readable articles and sharing links.

**Steps:** Inspect headings, author, sample dates, reading time, code, callouts, anchors, related articles, and share destinations without publishing.

**Expected:** Readable content with contained code scrolling; local sharing URLs are not presented as a live production site.

**Status:** Not Tested. **Notes:** [Result]

## 16. Contact Validation

**Objective:** Validate browser-only form behavior.

**Steps:** Submit empty fields, whitespace-only required text, malformed email, invalid optional URLs, and omitted privacy acknowledgment. Then use valid sample values.

**Expected:** Associated errors, first-invalid-field focus, optional disclosure opens when needed, and no server submission.

**Status:** Not Tested. **Notes:** [Result]

## 17. Mailto

**Objective:** Prepare a correctly encoded, complete draft.

**Steps:** Configure an address you control. Try `&`, `+`, `?`, accented text, line breaks, a long inquiry, and no default email app. Inspect the draft without sending.

**Expected:** Correct recipient/subject/body, all configured fields, optional omissions marked Not provided. Manual send is required; complete copy fallback survives link limits.

**Status:** Not Tested. **Notes:** [Result; restore placeholder for sample use]

## 18. Clipboard

**Objective:** Verify copy actions and denial handling.

**Steps:** Copy the address and full inquiry into a local editor. Deny clipboard permission and retry. Select the summary manually, then edit a field.

**Expected:** Honest success/error status; manually selectable full summary; stale prepared data clears. No form values in app storage.

**Status:** Not Tested. **Notes:** [Result]

## 19. Proposal

**Objective:** Review proposal-specific fields.

**Steps:** Fill sample scope, services, goals, timing, and budget with currency; inspect subject and full body.

**Expected:** All configured fields are represented; no quote, contract, upload, or automatic delivery is claimed.

**Status:** Not Tested. **Notes:** [Result]

## 20. Training Request

**Objective:** Validate international training inquiries.

**Steps:** Fill topic, audience, format, participant count, goals, dates, country/time zone. Try zero/fractional counts.

**Expected:** Required fields and positive whole counts are validated; all details retained; no enrollment or confirmed availability.

**Status:** Not Tested. **Notes:** [Result]

## 21. Consultation

**Objective:** Avoid false booking confirmation.

**Steps:** Submit sample contact, topic, preferred date/time, country/time zone, and optional context. Review prepared details.

**Expected:** Consultation-specific content and an explicit not-confirmed notice; no calendar reservation or payment.

**Status:** Not Tested. **Notes:** [Result]

## 22. Responsive Layout

**Objective:** Prevent clipped content and overlapping controls.

**Steps:** Review home, service tabs, listings, long details, forms, and footer at 320/390/768/1024/1440px and 200% zoom. Try long input values.

**Expected:** No page overflow, text collision, inaccessible controls, or unstable images. Category tabs scroll within their own row on narrow screens.

**Status:** Not Tested. **Notes:** [Result]

## 23. Keyboard And Motion

**Objective:** Complete core journeys without a pointer.

**Steps:** Use skip link, navigation, both tab groups, themes, filters, disclosures, forms, and footer links. Compare normal/reduced-motion preferences.

**Expected:** Logical visible focus, arrow/Home/End tab navigation, no trap outside the modal, optional motion disabled when requested, no hydration warnings.

**Status:** Not Tested. **Notes:** [Result]

## 24. Accessibility And Information Pages

**Objective:** Review semantics and supporting content.

**Steps:** Inspect headings, landmarks, labels, alternatives, and live announcements with browser accessibility tools/screen reader. Visit FAQ, feedback, resources, and legal pages; download three sample text files.

**Expected:** Meaningful names, no unsupported compliance claims, real downloads only, honest placeholders, and legal review disclaimers.

**Status:** Not Tested. **Notes:** [Technology used and remaining gaps]

## 25. Dark Theme

**Objective:** Check dark-theme contrast and states.

**Steps:** Inspect hero, body, cards, tabs, forms, errors, alerts, menus, code, disabled states, and footer. Hover/focus controls.

**Expected:** Readable content and visible state differences; no meaning relies on color alone.

**Status:** Not Tested. **Notes:** [Result]

## 26. Light Theme

**Objective:** Check light-theme contrast and initialization.

**Steps:** Repeat the previous checks in Light, then reload and navigate.

**Expected:** Consistent, legible colors, native controls, icons, and focus without theme-related layout shifts.

**Status:** Not Tested. **Notes:** [Result]

## 27. Not Found

**Objective:** Recover from unknown routes.

**Steps:** Visit `/missing-page`, `/services/missing-service`, and `/blog/missing-post`; use recovery links.

**Expected:** Custom 404, valid home/services links, no leaked stack trace.

**Status:** Not Tested. **Notes:** [Result]

## 28. Local Production

**Objective:** Verify the completed local build.

**Steps:** Run lint, typecheck, format:check, and build. Start production mode on a free port. Manually revisit navigation, interactions, forms, direct URLs, assets, sitemap, and robots. Inspect the network while preparing an inquiry.

**Expected:** Commands pass; local pages work; no backend submission, analytics, external font host, or email provider. Sitemap uses the configured local URL and sample indexing is disabled.

**Status:** Not Tested. **Notes:** [Record command results separately from browser coverage]
