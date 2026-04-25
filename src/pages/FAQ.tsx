import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";

const FAQ = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: { question: string; answer: ReactNode }[] = [
    {
      question:
        "What type of report do I need? (i.e., Calculation Valuation Report, Summary Report, Detailed Report)",
      answer:
        "The type of report needed can be determined with the assistance of a certified valuation expert and/or counsel. There are several different types of valuation reports, each of which are offered at a different price point and require varying amounts of time to complete. The 2 main types of reports that ABVFS offers include: Calculation Reports (calculation of value or calculated value) and Summary Report (conclusion of value).",
    },
    {
      question: "When are business valuations used?",
      answer:
        "Business valuations are required for many reasons such as mergers & acquisitions, divorce, estate planning, bankruptcy and financial auditing. The valuation appraiser looks at a company's profitability, risk, location, competition, history, applicable macro/micro economics, customers, assets, services offered, among other factors to determine an entity's value.",
    },
    {
      question: "How to determine the selling price and value?",
      answer:
        "There is no singular way to determine what a business is worth which is why the retainment of an experienced business valuation expert is imperative when trying to apply a value to an entity. A business owner may believe that their business is worth a lot more or less than the business valuation determined by the appraiser. Frequently, this is due to the fact that the business owner incorporates subjective, non-financial or emotional factors into the valuation that the potential interested party might not recognize as value.",
    },
    {
      question: "What is the Fair Market Value Versus Fair Value?",
      answer:
        "Fair market value (FMV) is the price that property would sell for on the open market. It is the price that would be agreed on between a willing buyer and a willing seller, with neither being required to act, and both having reasonable knowledge of the relevant facts. Fair Value is typically defined or imposed by a third party (e.g., by law, regulation, contract, or financial reporting standard-setting bodies) and is typically defined as the price that would be received to sell an asset or paid to transfer a liability in an orderly transaction between market participants at the measurement date.",
    },
    {
      question:
        'What is a "certified" valuation analyst and valuation analyst "accredited" in business valuations?',
      answer:
        "The National Association of Certified Valuators and Analysts (NACVA) is one of the most well respected and known business valuation associations. NACVA's CVA designation is the only valuation credential accredited by the National Commission for Certifying Agencies. The Accredited in Business Valuation (ABV®) credential is granted exclusively by the AICPA to CPAs and qualified valuation professionals who demonstrate considerable expertise in valuation.",
    },
    {
      question: "What is a Qualified Appraiser?",
      answer:
        "A qualified appraiser is an individual with verifiable education and experience in valuing the type of property for which the appraisal is performed. They must earn an appraisal designation from a generally recognized professional appraiser organization or meet minimum education and experience requirements.",
    },
    {
      question:
        "Are there situations in a litigation setting where a calculation engagement (calculation report) may not be appropriate in lieu of a valuation?",
      answer:
        "Yes. The decision to perform and disclose the results of a calculation engagement via written and/or oral testimony may not be appropriate in certain contested dispute/litigation settings. Some courts may attribute less weight to a calculation of value as compared to a conclusion of value for the same business since the nature of a calculation engagement is more limited in the scope of the procedures to be performed and therefore the value determined may be different had a valuation engagement been performed (NACVA Professional Standards Section V, C.3.g.). Any real or perceived benefits to a member's/credentialed designee's client should not be the sole reason for a member/credentialed designee choosing to perform a calculation engagement.",
    },
    {
      question:
        "What is the role of professional judgment in valuation and calculation engagements?",
      answer:
        "Professional judgment is essential throughout the valuation process, from selecting appropriate methods and data to interpreting results. Professional judgment is at the core of valuation practice. It ensures that the process is tailored to the specific circumstances of the engagement, yielding credible and reliable results. It involves applying knowledge, experience, and ethical considerations to make informed decisions.",
    },
    {
      question:
        "What Valuation Professional Organization Standards are applicable to all valuation types (i.e., Detailed, Summary, & Calculation)?",
      answer:
        "Summary and calculation engagements are always subject to the General and Ethical Standards which require the member/credentialed designee to apply professional judgment, obtain sufficient relevant data, exercise due professional care, remain objective, and maintain professional integrity while doing so in a professionally competent manner. \"A Calculation Engagement occurs when the client and member/credentialed designee agree to specific valuation approaches, methods, and the extent of selected procedures and results in a Calculated Value.\" (NACVA Standards III, B, 2). Interpretation: In a litigation or non-litigation setting, the primary difference between a conclusion of value and a calculated value is the scope of work agreed upon by the member/credentialed designee and the client. Certified Valuation Experts are advised to consider the impact a reduction in the scope of work could have on the result and inform their clients and counsel before beginning the engagement.",
    },
    {
      question: "When should a summary versus a detailed valuation report be used?",
      answer:
        "The form of the report \"…should be appropriate for the engagement, its purpose, its findings, and the needs of the decision makers who receive and rely upon it\" (Section V, B). The Certified Valuation Expert decides which report type to issue with the concurrence of the client. Interpretation: The Certified Valuation Expert should disclose the report type in the written or oral report. A Certified Valuation Expert should discuss with the client which type of report may be most appropriate for the given assignment before beginning the valuation engagement.",
    },
    {
      question:
        "How are valuation and calculation engagements performed in a litigation setting different from those performed outside of litigation?",
      answer:
        "A valuation or calculation engagement performed in a litigation setting can be very different from a similar engagement performed on the same subject business outside of litigation. A Certified Valuation Expert must work with their client and counsel to identify any key differences between a litigation and non-litigation engagement as the requirements of the end users may vary significantly. Interpretation: The Certified Valuation Expert should work with the relevant parties to identify the purpose, state and/or jurisdiction specific requirements, definitions, and application of appropriate standard/premise of value, developmental procedures, and/or reporting procedures in a litigation engagement. Valuation or calculation engagements in a litigation setting must treat the client and court as one in the same to establish the appropriate procedures, scope, and level of service necessary to achieve the objectives of the client/user with objectivity and integrity.",
    },
    {
      question:
        "Are there situations in a litigation setting where a calculation of value may be used in lieu of a conclusion of value?",
      answer:
        "Yes. A calculation of value may be preferred in lieu of a conclusion of value in a litigation setting for the purpose of settlement facilitation. A conclusion of value may be unavoidably problematic due to uncontrollable limitations or restrictions of data, time, or financial resources that effectively prohibit the performance of some, but not all, necessary valuation procedures. The Court may allow testimony on a calculation of value, which would go to the weight of the evidence not the admission of evidence. Further, the parties may stipulate to the calculation of value and/or the admission as evidence. Interpretation: In some cases, a calculation of value is preferred due to scope, time, and monetary limitations or based on the type of litigation setting. Additionally, both experts may agree to perform calculation engagements to address those limitations. However, it is important to note that a Certified Valuation Expert may not utilize a calculation engagement for the sole purpose of excluding relevant information or methods that may manipulate the ultimate value.",
    },
    {
      question:
        "Can a calculation engagement be performed if an opposing expert, party, or attorney restricts access to financial data, information, or inspection in a litigation setting?",
      answer:
        "It depends. The Certified Valuation Expert needs to analyze the facts and circumstances of the engagement to determine if she can develop a calculation of value given any restrictions or limitations. Interpretation: The Certified Valuation Expert must consider scope limitations which affect the level of reliance on the information and shall serve the client interest by seeking to accomplish the objectives established with the client, while maintaining integrity and objectivity. In litigation, opposing attorneys are free to question expert witnesses about alternative methods or approaches not considered in forming the opinions offered. If the opposing party or attorney restricts access to financial data (tax returns, financial statements, information [interviews, discovery responses], or inspection [site visits, making copies of pertinent documents]) in a litigation setting, the Valuation Professional should advise his/her client and/or attorney to advise the court of the opposing side's actions.",
    },
    {
      question:
        "Are standards of value, such as fair market value, treated the same from state to state relative to matrimonial dissolution litigation?",
      answer:
        "It depends. A Certified Valuation Expert must work with their client and/or attorney to identify the state specific terms, definitions, and application of the standard of value. Interpretation: Standards of value terms such as \"Fair Market Value\", \"Fair Value\", \"Investment Value\", and \"Intrinsic Value\" often have nuanced interpretations based upon the jurisdiction and litigatory purpose. This means that two states may use a standard of value term like \"Fair Market Value\" in a slightly different way despite both states adopting the same standard of value for a particular type of litigatory purpose. An example of this in action would be the state-to-state differences noted in the application of fair market value with regards to whether enterprise and personal goodwill are treated as marital assets or even distinguished at all.",
    },
    {
      question:
        "Is a calculation engagement an acceptable alternative to a valuation engagement in a litigation setting regardless of jurisdiction?",
      answer:
        "Not always. A valuation engagement is generally preferred over a calculation engagement in a litigation setting. Consequently, a calculation engagement is not always an acceptable alternative to a valuation engagement in a litigation setting. There are a number of situations common to litigation where a calculation engagement would not provide the trier of fact with information that assists them in making an ultimate determination in the case. However, there may be circumstances where a calculation engagement is appropriate in a litigation setting, such as when information is limited. Calculation engagements are commonly used for mediation and settlement purposes. Interpretation: A Certified Valuation Expert must consider scope limitations which affect the level of reliance on the information. In a litigation setting this would also include consideration of any and all relevant statutes and precedent governing how estimates of value may be determined, disclosed, or adduced.",
    },
    {
      question:
        "Can a Certified Valuation Expert serve as a joint expert for parties with adverse interests?",
      answer:
        "Yes, but because of the inherent adverse interests present within all joint engagements, it is critical that a Certified Valuation Expert maintain continuous adherence to the ethical principles within valuation standards. This heightened likelihood for scrutiny by either party to joint engagement places heightened emphasis on maintaining integrity and objectivity while ensuring clear communication to all clients as to the current and potential future roles of the Certified Valuation Expert. It is advisable to consult legal counsel before accepting such a role and to have a written understanding of the nature, scope, and limitations of the services and responsibilities of the Certified Valuation Expert, which may include representing only one party at a certain point in the engagement. If a conflict of interest arises during the engagement, the expert must immediately disclose it to all parties and consider recusal if it cannot be resolved.",
    },
    {
      question:
        "When acting as a joint expert, what should a Valuation Expert do if they discover a conflict of interest?",
      answer:
        "The Certified Valuation Expert has an ethical obligation to disclose any conflicts of interest to all parties immediately. They should consider recusing themselves from the engagement if the dispute cannot be resolved.",
    },
    {
      question:
        "Is the disclosure of a site visit required for a detailed, summary, or calculation report?",
      answer:
        "A Certified Valuation Expert is not required to conduct a site visit or disclose the site visit for a detailed, summary, or calculation report. The fundamental analysis may include a site visit disclosure for a conclusion of value. Interpretation: The decision on whether to conduct a site visit and the disclosure is up to the discretion of the Certified Valuation Expert.",
    },
    {
      question:
        "Can a Certified Valuation Expert rely on client-provided information without corroboration?",
      answer:
        "Yes, a Certified Valuation Expert may rely on information provided by a client or other source without corroboration, provided that such reliance is disclosed in their report. This means that a Certified Valuation Expert can rely on information provided by a client or other source without performing procedures to verify, validate, or otherwise substantiate the data/information, so long as the Certified Valuation Expert discloses the uncorroborated data/information relied upon in the report.",
    },
    {
      question:
        "What types of client-provided information can a Certified Valuation Expert rely upon?",
      answer:
        "While a Certified Valuation Expert may rely on various forms of information, including data, financial statements, tax returns, accounting records, and general ledger reports, this reliance does not extend to assumptions or areas requiring professional judgment. When performing an engagement to estimate value, a Certified Valuation Expert cannot rely solely on a client's assumptions about value without applying professional judgment. Interpretation: Section I (of NACVA Valuation Standards) notes, the use of professional judgment is an essential component of estimating value. Section II(F) of the NACVA Valuation Standards notes that a member/credentialed designee shall obtain sufficient relevant data to afford a reasonable basis for conclusions. Section IV(F) notes that professional judgment is used to select the approaches and the methods that best indicate the value.",
    },
    {
      question:
        "Does reliance on client-provided information extend to the client's selection or weighting of data?",
      answer:
        "No. While a Certified Valuation Expert can use the data provided, the Expert must exercise professional judgment in determining which data is most relevant and how it should be weighted in the analysis. A Credentialed Valuation Expert is responsible for analyzing the data and determining its appropriateness for the engagement. This includes determining the appropriateness of the agreed approaches, methods, and selected procedures, and the use of professional judgment.",
    },
    {
      question:
        "May a Credentialed Valuation Analyst rely solely on the output of an artificial intelligence (AI) tool when performing a business valuation engagement?",
      answer:
        "No. A Certified Valuation Professional must exercise professional judgment in the development of a valuation and cannot delegate that responsibility to AI. The use of AI must support, not replace, the analyst's responsibility to obtain sufficient relevant data and apply appropriate valuation methodologies.",
    },
    {
      question:
        "Does the use of AI tools impact the requirement for a Certified Valuation Professional to obtain sufficient relevant data?",
      answer:
        "No. The obligation to obtain sufficient relevant data under valuation standards remains unchanged. AI may enhance access to or analysis of data, but it does not substitute for the requirement of the adequacy and appropriateness of data sources.",
    },
    {
      question:
        "What types of engagements are always subject to the general and ethical standards?",
      answer:
        "All professional services, including calculations, valuations, and other services, whether they be a valuation service or an engagement that does not estimate value, are subject to the general and ethical standards which require the analyst to apply professional judgment, obtain sufficient relevant data, exercise due professional care, remain objective, and maintain professional integrity while doing so in a professionally competent manner.",
    },
    {
      question: "What is the difference between \"Mediation\" and \"Arbitration\"?",
      answer: (
        <div>
          <p className="font-semibold text-primary mb-2">Mediation</p>
          <ul className="list-disc pl-5 mb-4 space-y-1">
            <li>Informal process</li>
            <li>Low cost (relative), usually less than arbitration or litigation</li>
            <li>Result is mutually agreed upon</li>
            <li>Parties decide outcome; mediator does not have the power to decide</li>
            <li>Parties must decide and approve settlement</li>
            <li>Often can be less harmful to the parties&apos; relationship (v. binding arbitration or trial)</li>
          </ul>
          <p className="font-semibold text-primary mb-2">Arbitration (Binding)</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Formal process</li>
            <li>Moderate cost (relative)—more expensive than mediation but less than litigation</li>
            <li>Result is win/lose/split</li>
            <li>Arbitrator determines the dispute outcome</li>
            <li>Decision is final and binding</li>
            <li>May harm the parties&apos; relationship</li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageBanner
        title="Frequently Asked Questions"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "FAQs" }]}
      />

      {/* FAQ Section */}
      <section className="section-padding bg-background">
        <div className="container-wide max-w-4xl">
          <div className="text-center mb-16">
            <span className="text-accent font-inter font-semibold text-sm tracking-wider uppercase mb-4 block">
              Got Questions?
            </span>
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-primary mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground font-inter max-w-2xl mx-auto">
              Find answers to common questions about our services, process, and
              how we can help you achieve your financial goals.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="border border-border rounded-xl overflow-hidden"
              >
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className="w-full flex items-center justify-between p-6 text-left bg-background hover:bg-muted/50 transition-colors"
                >
                  <span className="font-playfair font-bold text-lg text-primary pr-4">
                    {faq.question}
                  </span>
                  <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                    {openIndex === index ? (
                      <Minus className="w-4 h-4 text-primary" />
                    ) : (
                      <Plus className="w-4 h-4 text-primary" />
                    )}
                  </div>
                </button>

                <motion.div
                  initial={false}
                  animate={{
                    height: openIndex === index ? "auto" : 0,
                    opacity: openIndex === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 pt-0 text-muted-foreground font-inter leading-relaxed">
                    {faq.answer}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Still Have Questions CTA */}
      <section className="section-padding bg-muted">
        <div className="container-wide text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-playfair font-bold text-primary mb-6">
              Still Have Questions?
            </h2>
            <p className="text-muted-foreground font-inter max-w-2xl mx-auto mb-8">
              Can't find the answer you're looking for? Our team is here to
              help. Reach out to us and we'll get back to you as soon as
              possible.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-accent text-primary px-8 py-4 rounded-lg font-inter font-semibold hover:bg-accent/90 transition-colors"
            >
              Contact Us
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQ;
