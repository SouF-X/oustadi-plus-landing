# Research and source decisions

## Product evidence
Source: https://github.com/ouaalane/OstadiPlusPrototype — tree b2fb4c096e44e80ef641ad7c1071c32c9df07804. Reviewed 90 selected source/documentation/screenshot files without running the app or modifying the original repository. The latest code is ahead of its older README and gap report. The marketing previews are original compositions based on the observed flows, not screenshots of a live production service.

Key sources: packages/shared/src/types.ts and tokens.ts; teacher-dashboard pages CourseEditor, Reception, Students, Questions; StudentStore.tsx; student screens Home, MyLearning, StudentCard, Quiz and Qna. Current code includes local-file video saving, enrollment periods, student-code lookup, membership response, progress and quiz feedback. Authentication, synchronization, secure licensing and production deployment are not demonstrated as a complete service. The QR-style matrix is decorative and has not been represented as working camera enrollment on the landing page.

## Design references
https://github.com/VoltAgent/awesome-design-md — community analyses, not official brand specifications. Read the Figma, Apple and Stripe DESIGN.md references. Used the discipline of explicit type/spacing roles and varied presentation density. Did not reproduce another company's logo, proprietary fonts, palette or page composition. Attribution retained here; the reference files are kept in work/prototype-review/brand-references and not shipped with the site.

https://primer.style/brand/ — GitHub's official marketing system distinguishes primitives, typography and purposeful components. Used as a reference for separating the overall identity from individual presentation elements.

https://atlassian.design/foundations/tokens — official guidance identifies tokens as the named source of design decisions. Applied through the site's semantic color roles and accompanying tokens.json.

https://www.teachable.com/ and https://support.teachable.com/en/articles/11682494-modify-your-school-theme — creator/student perspectives and provider branding informed the business explanation. Oustadi's scope remains Moroccan center/teacher infrastructure; no marketplace or payment-processing claims have been added.

https://www.apple.com/education/ — reviewed for product-focused hierarchy and concise learner-oriented messaging, not as a template to copy.

## Identity
The prototype already uses the previously selected education logo and #68234F / #FFCCA9 palette. The landing preserves that working identity. Any fresh logo exploration is a separate proposal until chosen; no existing app assets have been replaced.

## Conversion and privacy
The pilot form produces a UTF-8 text brief on the visitor's device. It does not collect or send leads. No analytics, external fonts, third-party scripts, fake testimonials, usage statistics, customer badges or pricing have been inserted.

## Final user steering
The user requested the original landing page’s classroom-to-phone hero and its French/Darija rhythm. Restored that direction in dist/scene.css, retaining the new prototype-derived interactions below. The short Darija explanation dialog and permanent Darija scene captions are intentional parts of the bilingual brand voice.
