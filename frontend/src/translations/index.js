import { pricingTranslations } from "./pricing";
import { partnerTranslations } from "./partner";
import { creditsTranslations } from "./credits";

// Cleaned and normalized translations base object (removed duplicated and malformed blocks)
const translationsBase = {
  en: {
    pricing: pricingTranslations.en,
    partner: partnerTranslations.en,
    credits: creditsTranslations.en,
    // Video Generation page translations (EN)
    videoGeneration: {
      headerTitle: 'Video Generation',
      headerSubtitle: 'Text-to-Video, Image-to-Video, and Video Enhance',
      tabs: {
  t2v: 'Text to Video',
  i2v: 'Image to Video',
        enhance: 'Enhance'
      },
      compare: {
        original: 'Original',
        enhanced: 'Enhanced'
      },
      form: {
        promptLabel: 'Prompt',
        promptT2VPlaceholder: 'Describe the video you want to generate',
        promptI2VPlaceholder: 'Describe the style and content you expect',
        ratioLabel: 'Aspect Ratio',
        durationLabel: 'Duration',
        seconds: '{sec}s',
        hdMode: 'HD Mode',
        clear: 'Clear',
        submit: 'Generate',
        submitting: 'Submitting…',
        generating: 'Generating…',
        uploadImageLabel: 'Upload Image',
        uploadImageDrop: 'Click or drag an image to upload',
        sizeLabel: 'Size',
        sizeSmall: 'Small',
        sizeLarge: 'Large',
        uploadVideoLabel: 'Upload Video',
        uploadVideoDrop: 'Click or drag a video to upload',
        resolutionLabel: 'Resolution',
        enhancing: 'Enhancing…',
        enhanceSubmit: 'Enhance'
      },
      alerts: {
        uploadImageFail: 'Image upload failed',
        needImageFile: 'Please select an image file',
        uploadVideoFail: 'Video upload failed',
        needVideoFile: 'Please select a video file',
        needVideoFirst: 'Please upload a video first',
        enhanceFail: 'Enhancement failed: {msg}',
        generateFailRetry: 'Generation failed. Please try again later.',
        generateFailWithMsg: 'Generation failed: {msg}',
        needPrompt: 'Please enter a prompt',
        imageUploadRetry: 'Image upload failed, please retry',
        needImageOrUrl: 'Image URL or uploaded image is required',
        unexpectedResponse: 'Unexpected response format',
        generateFail: 'Generation failed',
        notFoundStopped: 'Task not found, stopped',
        pollingFail: 'Polling failed. Please try again later.',
        i2vPollingFail: 'Image-to-Video polling failed.'
      },
      empty: {
        resultTitle: 'Your result will appear here',
        resultHint: 'Start a generation from the form on the left'
      }
    },
    helpCenter: {
      badge: 'Support',
      titleLine1: 'Help Center',
      titleLine2Gradient: 'FAQ',
      lastUpdatedPrefix: 'Last updated:',
      lastUpdatedDate: 'November 26, 2025',
      intro1: 'Welcome to the VGOT Help Center. Here you can find answers regarding our pricing, credit system, and feature limits based on your subscription plan.',
      intro2Prefix: 'If you cannot find the answer you are looking for, please contact our support team at',
      tocTitle: 'Table of Contents',
      tocItems: {
        item1: '1. Getting Started & Free Trial',
        item2: '2. Credits & Consumption Rules',
        item3: '3. Subscription Plans & Limits',
        item4: '4. Features Guide',
        item5: '5. Partner Program & Policies'
      },
      sections: {
        gettingStarted: {
          title: 'Getting Started & Free Trial',
          whatIs: {
            title: 'What is VGOT?',
            text: 'VGOT is a one-stop AI e-commerce video workflow platform. We help you create viral e-commerce videos in seconds using tools like HyperSell (product-to-video), Super IP (digital avatars), and Script Master.'
          },
          freeTrial: {
            title: 'Is there a free trial?',
            text: 'Yes. When you sign up for the Free (Experience) plan, you receive a one-time bonus of 200 credits to test the workflow.',
            notePrefix: 'Note:',
            noteText: 'The Free plan does not include recurring monthly credits. Once the 200 bonus credits are used, you will need to upgrade to continue generating content.'
          }
        },
        credits: {
          title: 'Credits & Consumption Rules',
          consumption: {
            title: 'How are credits consumed?',
            intro: 'VGOT uses a flexible credit system based on computing costs. Here is the breakdown:',
            items: {
              hypersell: { title: 'HyperSell Video (Short Ads)', text: '150 credits per video generation.' },
              superip: {
                title: 'Super IP Video (Digital Human)',
                points: {
                  p1: '30 credits per second of video duration.',
                  p2: 'Example: A 10-second digital avatar video costs 300 credits (10s × 30).'
                }
              },
              character: {
                title: 'Character Image',
                points: {
                  p1: '50 credits per image (Free & Creator Plans).',
                  highlight: 'FREE Unlimited',
                  p2: '(Business & Enterprise Plans).'
                }
              },
              voice: {
                title: 'Voice Creation',
                points: {
                  p1: '3,000 credits per custom voice creation (Creator Plan).',
                  p2Prefix: 'First custom voice is',
                  p2Highlight: 'FREE',
                  p2Suffix: '(Business Plan).'
                }
              },
              hd: { title: 'HD Enhancement', text: '500 - 800 credits per video upscale (Business plan gets a 40% discount).' }
            }
          },
          expiry: {
            title: 'Do my credits expire?',
            monthly: { prefix: '• Monthly Subscription:', text: 'Yes. Credits included in a monthly plan expire at the end of each billing month and do not roll over.' },
            yearly: { prefix: '• Yearly Subscription:', text: 'No (Annual Expiry). Credits included in a yearly plan are valid for the full 12-month billing cycle. Unused credits roll over month-to-month until the end of your subscription year.' },
            extra: { prefix: '• Extra Credit Packs:', text: 'No. Credits purchased separately as "Extra Packs" do not expire as long as your account remains active.' }
          },
          runOut: { title: 'What happens if I run out of credits?', text: 'You can purchase an add-on credit pack to continue generating immediately, or upgrade your plan to a higher tier.' }
        },
        subscription: {
          title: 'Subscription Plans & Limits',
          compare: {
            title: 'Where can I see the differences between plans?',
            textPrefix: 'Please visit our',
            linkText: 'Pricing Page',
            textSuffix: 'on the website for a full comparison of features, credit allowances, and limits for Free, Creator, Business, and Enterprise plans.'
          },
          change: {
            title: 'Can I upgrade/downgrade my plan?',
            intro: 'Yes, you can upgrade or downgrade your plan at any time in your account settings.',
            items: {
              upgrades: { prefix: 'Upgrades:', text: 'Take effect immediately.' },
              downgrades: { prefix: 'Downgrades:', text: 'Take effect at the end of your current billing cycle.' }
            }
          }
        },
        features: {
          title: 'Features Guide',
          hypersell: {
            title: 'HyperSell (E-Commerce Videos)',
            whatIs: { title: 'What is HyperSell?', text: 'HyperSell is our specialized tool for creating short, viral e-commerce videos from product images.' },
            points: { costPrefix: 'Cost:', costText: '150 credits per generation.', bestForPrefix: 'Best for:', bestForText: 'TikTok Ads, Amazon product videos, and Instagram Reels.' }
          },
          superip: {
            title: 'Super IP (Long-Form Digital Avatar)',
            whatIs: { title: 'What is Super IP?', text: 'Super IP allows you to generate realistic digital human videos for longer content (up to 10 mins on Business plan).' },
            points: { costPrefix: 'Cost:', costText: '30 credits per second of output video.', customizationPrefix: 'Customization:', customizationText: 'You can create your own custom voice or use our preset high-quality voices.' }
          },
          scriptMaster: {
            title: 'Script Master',
            how: { title: 'How does Script Generation work?' },
            points: {
              freePrefix: 'Free Plan:',
              freeText: 'Limited to 50 script generations per day.',
              paidPrefix: 'Paid Plans:',
              paidText: 'Unlimited script generation.',
              extra: 'You can extract scripts/promt from trending videos or auto-generate them from product descriptions.'
            }
          }
        },
        partner: {
          title: 'Partner Program & Policies',
          how: {
            title: 'How does the Partner Program work?',
            intro: 'Earn revenue by referring creators to VGOT.',
            items: {
              commission: { prefix: 'Commission:', text: '30% recurring commission on every paid subscription.' },
              payouts: { prefix: 'Payouts:', text: 'Automated via Stripe Connect.' }
            }
          },
          rights: {
            title: 'Do I get commercial rights?',
            items: {
              free: { prefix: 'Free Plan:', text: 'No. Content is for personal use/testing only.' },
              paid: { prefix: 'Paid Plans (Creator/Business/Enterprise):', text: 'Yes. You have full commercial rights to the videos you generate, including watermark-free export for advertising and social media.' }
            }
          },
          refund: {
            title: 'Refund Policy',
            items: {
              subscriptions: { prefix: 'Subscriptions:', text: 'You can cancel anytime to stop future billing.' },
              credits: { prefix: 'Credits:', text: 'Since generating AI video consumes significant GPU computing costs, credits are generally non-refundable once used for generation.' }
            }
          }
        }
      }
    },
    terms: {
      title: 'Terms of Service',
      lastUpdatedPrefix: 'Last Updated:',
      intro1: 'Please read these Terms of Service ("Terms") carefully before using the VGOT platform (the "Service") operated by INFINITE UNIVERSE TECHNOLOGY CO., LTD ("VGOT", "we", "us", or "our").',
      intro2: 'By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.',
      sections: {
        accounts: {
          title: '1. Accounts and Registration',
          intro: 'To access certain features of the Service (such as the Workspace, Super IP, or Partner Program), you must register for an account.',
          bullets: {
            accuracy: 'Accuracy: You agree to provide accurate, current, and complete information during the registration process.',
            security: 'Security: You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.',
            age: "Age Restriction: You must be at least 13 years old to use the Service. If you are under 18, you represent that you have your parent or guardian's permission to use the Service.",
            sharing: 'Account Sharing: Sharing your account credentials with others to bypass subscription limits ("seat sharing") is strictly prohibited and may result in account suspension.'
          }
        },
        subscription: {
          title: '2. Subscription, Credits, and Payments',
          plansTitle: '2.1. Subscription Plans',
            plansIntro: 'VGOT offers free and paid subscription plans (e.g., Creator, Enterprise).',
            plansBullets: {
              billing: 'Billing: Paid subscriptions are billed in advance on a recurring and periodic basis (monthly or annually).',
              cancellation: 'Cancellation: You may cancel your subscription at any time through your account settings. Your subscription will remain active until the end of the current billing cycle.'
            },
            creditsTitle: '2.2. Credits & Usage Policy',
            creditsIntro: 'The Service operates on a credit-based system (as shown in your "Credits & Usage" dashboard).',
            creditsBullets: {
              consumption: 'Consumption: Different actions consume different amounts of credits (e.g., script_rewrite, superip_image_gen, video_generation). We reserve the right to adjust credit costs for features at any time.',
              expirationMonthly: 'Monthly Credits: Credits included in your monthly subscription plan expire at the end of each billing cycle and do not roll over.',
              expirationExtra: 'Extra Packs: Credits purchased as "Extra Credit Packs" (Pay-as-you-go) do not expire as long as your account remains active.'
            },
            refundTitle: '2.3. Refund Policy',
            refundBullets: {
              general: 'General Rule: Except as required by applicable law, all fees (including subscriptions and credit packs) are non-refundable.',
              waiver: 'Digital Content Waiver (UK/EU Customers): If you are a consumer in the UK or EU, you normally have a right to cancel within 14 days. However, by using the Service to generate content you expressly waive your right of withdrawal.',
              unused: 'No Refunds for Unused Credits: We do not offer refunds or credits for partially used subscription periods or unused credits upon cancellation.'
            }
        },
        userContent: {
          title: '3. User Content and AI Generation',
          inputTitle: '3.1. User Input',
          inputIntro: 'You retain all rights to the text prompts, images, audio, and video files you upload to the Service ("User Input"). You warrant you own or have rights to use it.',
          featureTitle: '3.2. Specific Feature Policies',
          hypersellBullets: {
            commercial: 'Commercial Use: You represent you own rights to products, brands, and images uploaded to HyperSell and comply with advertising laws.',
            counterfeits: 'No Counterfeits: Do not promote counterfeit, illegal, or misleading products.'
          },
          superipBullets: {
            consent: 'Strict Consent: Do NOT upload photos or voice recordings of third parties without explicit written consent.',
            biometric: 'Biometric Data: Do not impersonate politicians, public figures, or non-consenting individuals.'
          },
          ownershipTitle: '3.3. Output Ownership',
          ownershipBullets: {
            free: 'Free Plan Users: VGOT retains ownership; you get a limited personal license. We may showcase generated content.',
            paid: 'Paid Plan Users: You retain full ownership and IP rights to generated content while subscribed and compliant.'
          }
        },
        partner: {
          title: '4. Partner Program',
          intro: 'If you join the VGOT Partner Program:',
          bullets: {
            commission: 'Commission: Earn recurring commissions on qualified sales via your referral link.',
            payouts: 'Payouts: Processed via Stripe Connect. Provide accurate tax/banking info.',
            prohibited: 'Prohibited Behavior: Self-referrals, bidding on branded keywords, spamming, or misleading ads result in ban and forfeiture.'
          }
        },
        acceptable: {
          title: '5. Acceptable Use & Prohibited Content',
          intro: 'You agree NOT to use the Service to generate, upload, or share content that:',
          prohibitedList: {
            illegal: 'Illegal Content: Violates law (e.g., child exploitation, illegal acts).',
            sexual: 'Sexually Explicit: Contains nudity, pornography, or sexually explicit material.',
            hate: 'Hate Speech & Harassment: Promotes violence, discrimination, hatred, or harassment.',
            deepfakes: 'Deepfakes & Misinformation: Misleads, spreads disinformation, impersonates without consent.',
            selfHarm: 'Self-Harm: Promotes self-harm, suicide, or eating disorders.',
            ip: 'Intellectual Property Infringement: Violates copyright, trademark, or privacy rights.'
          },
          platformTitle: 'Platform Restrictions:',
          platformBullets: {
            scripts: 'No automated scripts/bots for scraping.',
            reverse: 'No reverse engineering or model weight extraction attempts.',
            compete: 'Do not use the Service to build a competing product.'
          }
        },
        analysis: {
          title: '6. Video Analysis & Third-Party Links',
          intro: 'The "Scripts" and "Analyze Video" features allow URL input from third-party platforms.',
          bullets: {
            affiliation: 'No Affiliation: Not affiliated with TikTok, Instagram, or YouTube.',
            responsibility: 'Responsibility: Ensure analyzed data usage does not violate original creators copyrights.'
          }
        },
        disclaimer: {
          title: '7. Disclaimer of Warranties',
          intro: 'Service provided "AS IS" / "AS AVAILABLE". AI may generate incorrect/offensive content. Not for professional advice. No guarantee of uninterrupted or error-free service.'
        },
        liability: {
          title: '8. Limitation of Liability',
          intro: 'We are not liable for indirect, incidental, special, consequential, or punitive damages including loss of profits, data, goodwill.'
        },
        indemnification: {
          title: '9. Indemnification',
          intro: 'You agree to indemnify and hold harmless VGOT and affiliates from claims arising from your use, breach of Terms, or content.'
        },
        termination: {
          title: '10. Termination',
          intro: 'We may suspend or terminate accounts immediately for any breach. Upon termination rights cease.'
        },
        law: {
          title: '11. Governing Law',
          intro: 'Terms governed by UK law. Actions must be brought in UK courts.'
        },
        contact: {
          title: '12. Contact Us',
          intro: 'If you have questions about these Terms, contact us:',
          emailPrefix: 'By email:'
        }
      }
    },
    nav: {
      home: 'Home',
      features: 'Features',
      solutions: 'Solutions',
      pricing: 'Pricing',
      partner: 'Partner Program',
      helpCenter: 'Help Center',
      help: 'Help',
      login: 'Log in',
      startFree: 'Start Free Trial',
    },
    hero: {
      badge: 'AI-Powered Video Creation Platform',
      headline1: 'One-Stop AI E-Commerce Video Workflow',
      headline2: 'Create Viral E-Commerce Videos in Seconds',
      subheading: 'From script copying to HyperSell video generation and digital expert narration—VGOT handles your entire e-commerce video workflow.',
      sellingPoint1: 'Free Script Creation & Extraction',
      sellingPoint2: 'Smart One-Click Prompt Duplication',
      sellingPoint3: 'Up to 10-Min Ultra-Fast Video Generation',
      sellingPoint4: 'AI-Powered 4K Quality Enhancement',
      ctaPrimary: 'Start Creating for Free',
      ctaSecondary: 'View Pricing',
      stats: 'Trusted by 10,000+ creators',
      videosGenerated: '2M+ videos generated',
      // New localized micro-texts used inside Hero component
      activateEngine: 'ACTIVATE VIRAL ENGINE',
      waiting: 'Waiting for input...',
      distribute: 'Distribute directly to',
      viewsLabel: 'Views',
      salesLabel: 'Sales',
    },
    trustLogos: { title: 'Trusted by leading platforms' },
    features: {
      title: 'Say Goodbye to Complexity—Revolutionize Your E-Commerce Video Creation with AI',
      subtitle: 'From script ideation to video publishing, VGOT provides everything you need.',
      scriptGenerator: {
        title: 'Script Master',
        description: 'Whether auto-generating from your product descriptions or intelligently extracting scripts from trending videos, VGOT helps you overcome writer\'s block.',
      },
      soraVideo: {
        title: 'Smart Prompt',
        description: 'Intelligently analyze and precisely extract the key prompts behind video generation, allowing you to easily replicate success without trial and error.',
      },
      digitalExpert: {
        title: 'Long-Form Video Maker',
        description: 'Break through short video time limits—supports generating digital human videos up to 10 minutes long to meet all your deep content needs.',
      },
      videoTools: {
        title: 'AI Quality Enhance',
        description: 'Exclusive AI algorithm instantly transforms low-resolution, blurry videos into cinema-grade 4K quality, making your work stand out.',
      },
    },
    painPoints: {
      title: 'Tired of These Challenges?',
      slowScript: { title: 'Slow Scriptwriting', description: 'Spending hours brainstorming scripts for every video? AI script generation gets you started instantly.' },
      complexTools: { title: 'Complex Video Tools', description: 'Juggling multiple platforms for editing, captions, and effects? VGOT consolidates everything into one workflow.' },
      poorQuality: { title: 'Inconsistent Quality', description: 'Struggling with low-res footage or unprofessional narration? VGOT ensures every video looks polished and professional.' },
      timeConsuming: { title: 'Time-Consuming Edits', description: 'Spending days on post-production? Our automation cuts editing time by up to 90%.' },
    },
    useCases: {
      title: 'Perfect for Every E-Commerce Scenario',
      productDemo: { title: 'Product Demos', description: 'Showcase features with AI-narrated videos that turn browsers into buyers.' },
      unboxing: { title: 'Unboxing Videos', description: 'Build excitement with professional unboxing content featuring AI presenters.' },
      tutorial: { title: 'How-To Guides', description: 'Educate customers with clear, step-by-step tutorial videos.' },
      testimonial: { title: 'Customer Stories', description: 'Turn testimonials into compelling video narratives with digital avatars.' },
      comparison: { title: 'Product Comparisons', description: 'Help shoppers decide with side-by-side comparison videos.' },
      socialMedia: { title: 'Social Media Ads', description: 'Optimize videos for TikTok, Instagram, and YouTube in seconds.' },
    },
    howItWorks: {
      title: 'Three Simple Steps to Viral Videos',
      step1: { title: 'Input or Extract', description: 'Paste your product URL, upload reference videos, or use our AI to extract popular scripts.' },
      step2: { title: 'Customize & Generate', description: 'Choose your style, voice, and duration. Let HyperSell create stunning videos in minutes.' },
      step3: { title: 'Enhance & Publish', description: 'Apply filters, add subtitles, translate languages, and distribute directly to your platforms.' },
    },
    valueProposition: {
      title1: 'Say Goodbye to High Costs and Low Efficiency',
      title2: 'Make Every Investment Count',
      description: 'VGOT turns what used to take days and cost thousands into a few clicks. Generate product videos, scripts, and digital narrators—all in one platform. Join 10,000+ creators already scaling their e-commerce content.',
      cta: 'Try It Free Now',
    },
    pricingTeaser: {
      title: 'Transparent Pricing for Every Creator',
      description: 'Start free, scale as you grow. No hidden fees.',
      ctaPrimary: 'View Full Pricing',
      freeTag: 'Free Forever',
      proTag: 'Most Popular',
      enterpriseTag: 'Custom Solutions',
    },
    partnerProgram: {
      title: 'Join Our Partner Program',
      description: 'Earn recurring commissions by promoting VGOT to your audience.',
      commission: 'Up to 30% Commission',
      support: 'Dedicated Partner Support',
      resources: 'Marketing Materials Provided',
      ctaPrimary: 'Become a Partner',
    },
    footer: {
      description: 'Empower your e-commerce with AI-driven video creation.',
      product: 'Product',
      features: 'Features',
      pricing: 'Pricing',
      useCases: 'Use Cases',
      company: 'Company',
      about: 'About Us',
      blog: 'Blog',
      careers: 'Careers',
      support: 'Support',
      help: 'Help Center',
      docs: 'Documentation',
      contact: 'Contact',
      activateEngine: '启动爆款引擎',
      waiting: '等待输入中…',
      distribute: '一键分发至',
      viewsLabel: '播放',
      salesLabel: '销量',
      legal: 'Legal',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      cookies: 'Cookie Policy',
      copyright: '© 2025 VGOT. All rights reserved.',
    },
    contact: {
      badge: 'Contact Us',
      titleLine1: "Let's start a",
      titleLine2Gradient: 'conversation.',
      subtitle: 'Whether you have questions about our Enterprise plans, need a custom demo, or just want to say hello, we are here for you.',
      generalSupportLabel: 'General Support',
      partnerProgramLabel: 'Partner Program'
    },
    privacy: {
      title: 'Privacy Policy',
      lastUpdatedPrefix: 'Last updated:',
      intro1: 'This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.',
      intro2: 'We use Your Personal data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy.',
      interpretationTitle: 'Interpretation and Definitions',
      interpretation: 'Interpretation',
      interpretationText: 'The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.',
      definitions: 'Definitions',
      definitionsIntro: 'For the purposes of this Privacy Policy:',
      definitionsList: {
        account: 'Account means a unique account created for You to access our Service or parts of our Service.',
        company: 'Company (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to INFINITE UNIVERSE TECHNOLOGY CO., LTD.',
        cookies: 'Cookies are small files that are placed on Your computer, mobile device or any other device by a website, containing the details of Your browsing history on that website among its many uses.',
        country: 'Country refers to: United Kingdom',
        device: 'Device means any device that can access the Service such as a computer, a cellphone or a digital tablet.',
        personalData: 'Personal Data is any information that relates to an identified or identifiable individual.',
        service: 'Service refers to the Website.',
        serviceProvider: 'Service Provider means any natural or legal person who processes the data on behalf of the Company.',
        usageData: 'Usage Data refers to data collected automatically, either generated by the use of the Service or from the Service infrastructure itself.',
        website: 'Website refers to VGOT, accessible from https://www.vgot.ai',
        you: 'You means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.'
      },
      collectingTitle: 'Collecting and Using Your Personal Data',
      typesCollectedTitle: 'Types of Data Collected',
      personalDataTitle: 'Personal Data',
      personalDataIntro: 'While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to:',
      personalDataItems: {
        email: 'Email address',
        credentials: 'Account credentials (securely encrypted)',
        payment: 'Payment and billing information (processed securely through third-party processors)',
        usageData: 'Usage Data'
      },
      userContentTitle: 'User Content',
      userContentIntro: 'To provide our AI generation services, We collect and process content that You upload, input, or generate through the Service ("User Content"). This includes, but is not limited to:',
      userContentItems: {
        media: 'Media Assets: Images, photographs, video files, and audio recordings.',
        text: 'Text Inputs: Text prompts, scripts, branding text, and public URLs provided for analysis.',
        biometric: 'Biometric-like Data: If your User Content contains facial images or voice recordings, we process this data to generate the specific video output you requested.'
      },
      usageDataTitle: 'Usage Data',
      usageDataIntro: "Usage Data is collected automatically when using the Service. Usage Data may include information such as Your Device's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that You visit, the time and date of Your visit, the time spent on those pages, unique device identifiers and other diagnostic data.",
      trackingTitle: 'Tracking Technologies and Cookies',
      trackingIntro: 'We use Cookies and similar tracking technologies to track the activity on Our Service and store certain information.',
      trackingItems: {
        necessary: 'Necessary Cookies: Essential for authentication and security.',
        functionality: 'Functionality Cookies: To remember your preferences and settings.',
        analytics: 'Analytics & Affiliate Cookies: To track service performance and attribute partner referrals.'
      },
      useTitle: 'Use of Your Personal Data',
      useIntro: 'The Company may use Personal Data and User Content for the following purposes:',
      useItems: {
        provide: 'To provide and maintain our Service: Including creating the AI-generated videos, audios, and scripts you request.',
        manageAccount: 'To manage Your Account: To manage your registration as a user of the Service.',
        contract: 'For the performance of a contract: To process your subscription and ensure delivery of purchased services.',
        contactYou: 'To contact You: By email regarding updates, security alerts, or informative communications related to the functionalities.',
        improve: 'To improve and develop our Service: To identify usage trends, determine the effectiveness of our promotional campaigns, and to improve our AI algorithms and machine learning models.',
        requests: 'To manage Your requests: To attend and manage Your requests to Us.',
        transfers: 'For business transfers: We may use Your information to evaluate or conduct a merger, divestiture, restructuring, reorganization, dissolution, or other sale or transfer of some or all of Our assets.'
      },
      thirdPartyTitle: 'Third-Party Service Providers',
      thirdPartyIntro: 'We may employ third-party companies and individuals to facilitate our Service ("Service Providers"), to provide the Service on our behalf, or to assist us in analyzing how our Service is used. These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.',
      thirdPartyItems: {
        ai: 'AI Processing: We use trusted third-party AI models to process your User Content (text, image, and audio) to generate the final video output.',
        payments: 'Payments: We use third-party payment processors (such as Stripe) for secure payment processing. We do not store your full credit card details.',
        analytics: 'Analytics: We may use third-party Service providers to monitor and analyze the use of our Service.'
      },
      retentionTitle: 'Retention of Your Personal Data',
      retentionIntro: 'The Company will retain Your Personal Data and User Content only for as long as is necessary for the purposes set out in this Privacy Policy.',
      retentionItems: {
        account: 'Account Data: Retained for the duration of your account existence.',
        content: 'User Content: We retain your input assets (such as uploaded photos/voices) and generated outputs in your library for your convenience. We may delete old content from Free Plan users after a prolonged period of inactivity to manage storage.',
        legal: 'Legal Obligations: We will retain and use Your Personal Data to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our legal agreements and policies.'
      },
      transferTitle: 'Transfer of Your Personal Data',
      transferIntro: 'Your information, including Personal Data, is processed at the Company\'s operating offices and in any other places where the parties involved in the processing are located. It means that this information may be transferred to — and maintained on — computers located outside of Your state, province, country or other governmental jurisdiction where the data protection laws may differ than those from Your jurisdiction.',
      deleteTitle: 'Delete Your Personal Data',
      deleteIntro: 'You have the right to delete or request that We assist in deleting the Personal Data that We have collected about You. You may update, amend, or delete Your information (including generated videos and uploaded assets) at any time by signing in to Your Account and managing your library. To request the permanent deletion of your account and all associated data, please contact us at ',
      disclosureTitle: 'Disclosure of Your Personal Data',
      disclosureItems: {
        business: 'Business Transactions: If the Company is involved in a merger, acquisition or asset sale, Your Personal Data may be transferred.',
        law: 'Law enforcement: Under certain circumstances, the Company may be required to disclose Your Personal Data if required to do so by law or in response to valid requests by public authorities.',
        consent: 'With Your Consent: We may disclose Your personal information for any other purpose with Your consent.'
      },
      childrenTitle: "Children's Privacy",
      childrenIntro: 'Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from anyone under the age of 13.',
      linksTitle: 'Links to Other Websites',
      linksIntro: 'Our Service may contain links to other websites that are not operated by Us. If You click on a third party link, You will be directed to that third party\'s site. We strongly advise You to review the Privacy Policy of every site You visit.',
      rightsTitle: 'Your Data Protection Rights (GDPR / UK GDPR)',
      rightsIntro: 'If you are a resident of the United Kingdom (UK) or the European Economic Area (EEA), you have certain data protection rights, including the right to access, rectify, delete, restrict, or object to the processing of your Personal Data. To exercise any of these rights, please contact us at ',
      changesTitle: 'Changes to this Privacy Policy',
      changesIntro: 'We may update Our Privacy Policy from time to time. We will notify You of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy.',
      contactTitle: 'Contact Us',
      contactIntro: 'If you have any questions about this Privacy Policy, You can contact us:',
      contactEmailPrefix: 'By email:'
    },
  },
  "zh-CN": {
    pricing: pricingTranslations["zh-CN"],
    partner: partnerTranslations["zh-CN"],
    credits: creditsTranslations["zh-CN"],
    helpCenter: {
      badge: '支持',
      titleLine1: '帮助中心',
      titleLine2Gradient: '常见问题',
      lastUpdatedPrefix: '最后更新：',
      lastUpdatedDate: '2025年11月26日',
      intro1: '欢迎来到 VGOT 帮助中心。您可以在此了解我们的定价、积分规则以及不同订阅计划对应的功能限制。',
      intro2Prefix: '若未找到答案，可通过以下邮箱联系支持团队',
      tocTitle: '目录',
      tocItems: {
        item1: '1. 入门与免费试用',
        item2: '2. 积分与消耗规则',
        item3: '3. 订阅计划与限制',
        item4: '4. 功能指南',
        item5: '5. 推广计划与政策'
      },
      sections: {
        gettingStarted: {
          title: '入门与免费试用',
          whatIs: {
            title: '什么是 VGOT？',
            text: 'VGOT 是一体化 AI 电商视频工作流平台。我们通过 HyperSell（商品转视频）、Super IP（数字人）、Script Master 等工具，帮助您用秒级速度生成爆款电商视频。'
          },
          freeTrial: {
            title: '是否提供免费试用？',
            text: '是的。注册免费（体验）计划后，您将一次性获得 200 积分以测试工作流。',
            notePrefix: '注意：',
            noteText: '免费计划不包含每月循环积分。用完这 200 积分后，需升级以继续生成内容。'
          }
        },
        credits: {
          title: '积分与消耗规则',
          consumption: {
            activateEngine: '啟動爆款引擎',
            waiting: '等待輸入中…',
            distribute: '一鍵分發至',
            viewsLabel: '播放',
            salesLabel: '銷量',
            title: '积分如何消耗？',
            intro: 'VGOT 根据计算成本采用灵活的积分制度，具体如下：',
            items: {
              hypersell: { title: 'HyperSell 视频（短广告）', text: '每次生成 150 积分。' },
              superip: {
                title: 'Super IP 视频（数字人）',
                points: {
                  p1: '每秒输出视频消耗 30 积分。',
                  p2: '示例：10 秒数字人视频消耗 300 积分（10×30）。'
                }
              },
              character: {
                title: '角色形象',
                points: {
                  p1: '每张图片 50 积分（免费与 Creator 计划）。',
              activateEngine: 'ACTIVAR MOTOR VIRAL',
              waiting: 'Esperando entrada…',
              distribute: 'Distribuye directamente a',
              viewsLabel: 'Vistas',
              salesLabel: 'Ventas',
                  highlight: '免费不限量',
                  p2: '（Business 与 Enterprise 计划）。'
                }
              },
              voice: {
                title: '声音创建',
                points: {
                  p1: '每个自定义声音 3,000 积分（Creator 计划）。',
                  p2Prefix: '首个自定义声音',
                  p2Highlight: '免费',
                  p2Suffix: '（Business 计划）。'
                }
              },
              hd: { title: '高清增强', text: '每次升级 500 - 800 积分（Business 计划享 40% 折扣）。' }
            }
          },
          expiry: {
            title: '积分是否过期？',
            monthly: { prefix: '• 月订阅：', text: '是。月度计划内积分在每个结算周期末到期，不可结转。' },
            yearly: { prefix: '• 年订阅：', text: '否（年限到期）。年度计划积分在 12 个月周期内有效，未用积分可在年内按月结转。' },
            extra: { prefix: '• 额外积分包：', text: '否。按次购买的“额外积分包”在账户活跃期间不失效。' }
          },
          runOut: { title: '积分用完怎么办？', text: '您可以购买额外积分包立即继续生成，或升级到更高等级计划。' }
        },
        subscription: {
          title: '订阅计划与限制',
          compare: {
            title: '在哪里查看不同计划的差异？',
            textPrefix: '请访问网站上的',
            linkText: '定价页面',
            textSuffix: '，了解免费、Creator、Business 与 Enterprise 的功能、积分额度与限制的完整对比。'
          },
          change: {
            title: '可以升级/降级计划吗？',
            intro: '可以，您可在账户设置中随时升级或降级。',
            items: {
              upgrades: { prefix: '升级：', text: '立即生效。' },
              downgrades: { prefix: '降级：', text: '在当前计费周期结束后生效。' }
            }
          }
        },
        features: {
          title: '功能指南',
          hypersell: {
            title: 'HyperSell（电商短视频）',
            whatIs: { title: '什么是 HyperSell？', text: 'HyperSell 是我们专为商品图片生成爆款短视频的工具。' },
            points: { costPrefix: '费用：', costText: '每次生成 150 积分。', bestForPrefix: '适用场景：', bestForText: 'TikTok 广告、亚马逊商品视频、Instagram Reels 等。' }
          },
          superip: {
            title: 'Super IP（长内容数字人）',
            whatIs: { title: '什么是 Super IP？', text: 'Super IP 可生成逼真的数字人视频，适用于更长内容（Business 计划最高 10 分钟）。' },
            points: { costPrefix: '费用：', costText: '每秒输出视频消耗 30 积分。', customizationPrefix: '自定义：', customizationText: '可创建自定义声音或使用我们预设的高质量声音。' }
          },
          scriptMaster: {
            title: 'Script Master',
            how: { title: '脚本生成如何工作？' },
            points: {
              freePrefix: '免费计划：',
              freeText: '每日限 50 次脚本生成。',
              paidPrefix: '付费计划：',
              paidText: '脚本生成不限量。',
              extra: '可从热门视频提取脚本/提示词，或根据商品描述自动生成。'
            }
          }
        },
        partner: {
          title: '推广计划与政策',
          how: {
            title: '推广计划如何运作？',
            intro: '通过推荐创作者加入 VGOT 获取收益。',
            items: {
              commission: { prefix: '佣金：', text: '每个付费订阅享 30% 持续分成。' },
              payouts: { prefix: '结算：', text: '通过 Stripe Connect 自动打款。' }
            }
          },
          rights: {
            title: '是否拥有商业使用权？',
            items: {
              free: { prefix: '免费计划：', text: '不。内容仅供个人使用/测试。' },
              paid: { prefix: '付费计划（Creator/Business/Enterprise）：', text: '是。您拥有生成视频的完整商业权利，支持无水印导出用于投放与社媒。' }
            }
          },
          refund: {
            title: '退款政策',
            items: {
              subscriptions: { prefix: '订阅：', text: '可随时取消以停止后续扣费。' },
              credits: { prefix: '积分：', text: '由于 AI 视频生成需要大量 GPU 成本，积分一旦用于生成，一般不予退款。' }
            }
          }
        }
      }
    },
    terms: {
      title: '服务条款',
      lastUpdatedPrefix: '最后更新：',
      intro1: '在使用由 INFINITE UNIVERSE TECHNOLOGY CO., LTD（“VGOT”、“我们”）运营的 VGOT 平台（“服务”）前请仔细阅读本服务条款（“条款”）。',
      intro2: '访问或使用本服务即表示您同意受本条款约束；若不同意其中任何部分，您将无法继续访问服务。',
      sections: {
        accounts: {
          title: '1. 账户与注册',
          intro: '要使用服务的某些功能（工作区、Super IP、推广计划等），您必须注册账户。',
          bullets: {
            accuracy: '准确性：您承诺提供准确、最新、完整的注册信息。',
            security: '安全：您需妥善保管用于访问服务的密码，并对密码下的一切活动负责。',
            age: '年龄限制：您必须年满13岁；若未满18岁，需确认已获得监护人许可。',
            sharing: '账户共享：为规避订阅限制而与他人共享账户（“席位共享”）被严格禁止，可能导致账号暂停。'
          }
        },
        subscription: {
          title: '2. 订阅、积分与支付',
          plansTitle: '2.1 订阅计划',
          plansIntro: 'VGOT 提供免费与付费订阅（如 Creator、Enterprise）。',
          plansBullets: {
            billing: '计费：付费订阅按周期（按月或按年）预先循环扣费。',
            cancellation: '取消：可在账户设置中随时取消订阅，取消后服务持续至当期结束。'
          },
          creditsTitle: '2.2 积分与使用政策',
          creditsIntro: '服务采用积分制（显示于“Credits & Usage”面板）。',
          creditsBullets: {
            consumption: '消耗：不同操作消耗不同积分（如 script_rewrite、superip_image_gen、video_generation），我们保留调整的权利。',
            expirationMonthly: '月度积分：当期结束后失效，不可结转。',
            expirationExtra: '额外包：按次购买的积分在账户保持活跃时不失效。'
          },
          refundTitle: '2.3 退款政策',
          refundBullets: {
            general: '一般规定：除法律另有要求，所有费用（订阅与积分包）不予退款。',
            waiver: '数字内容放弃（英国/EU 用户）：开始生成内容即视为您明确放弃14天撤销权。',
            unused: '未用积分不退款：取消后未用积分或剩余周期不予补偿。'
          }
        },
        userContent: {
          title: '3. 用户内容与 AI 生成',
          inputTitle: '3.1 用户输入',
          inputIntro: '您保留上传的文本、图片、音频、视频文件（“用户输入”）权利，并保证拥有必要授权。',
          featureTitle: '3.2 功能特定政策',
          hypersellBullets: {
            commercial: '商业用途：您保证拥有产品、品牌、图片使用权，并遵守投放平台广告法规。',
            counterfeits: '禁止仿冒：不得推广假冒、非法或误导性商品。'
          },
          superipBullets: {
            consent: '严格同意：不得上传第三方照片或语音，除非获得明确书面授权。',
            biometric: '生物特征：不得用于冒充公众人物或未同意个人。'
          },
          ownershipTitle: '3.3 输出归属',
          ownershipBullets: {
            free: '免费方案：VGOT 保留生成内容所有权，您获个人非独占使用许可；我们可用于展示。',
            paid: '付费方案：在遵守条款前提下，您拥有生成内容的全部知识产权。'
          }
        },
        partner: {
          title: '4. 推广合作计划',
          intro: '加入 VGOT 推广合作计划后：',
          bullets: {
            commission: '佣金：合格销售可获循环佣金。',
            payouts: '支付：通过 Stripe Connect 结算，需提供准确税务与银行信息。',
            prohibited: '禁止行为：自购返佣、竞价品牌词、垃圾信息或误导广告将被封禁并没收未结算佣金。'
          }
        },
        acceptable: {
          title: '5. 合理使用与禁止内容',
          intro: '您同意不借助服务生成、上传或分享以下内容：',
          prohibitedList: {
            illegal: '违法内容：违反适用法律（如儿童剥削、非法行为）。',
            sexual: '性露骨：包含裸体、色情或性露骨材料。',
            hate: '仇恨言论与骚扰：鼓动暴力、歧视或仇恨。',
            deepfakes: '深度伪造与虚假：误导、散布虚假信息或未经同意冒充。',
            selfHarm: '自残：鼓励自残、自杀或饮食失调。',
            ip: '侵权：侵犯版权、商标或隐私权。'
          },
          platformTitle: '平台限制：',
          platformBullets: {
            scripts: '禁止自动脚本/机器人抓取。',
            reverse: '禁止逆向工程或尝试提取模型权重。',
            compete: '禁止利用服务构建竞争产品。'
          }
        },
        analysis: {
          title: '6. 视频分析与第三方链接',
          intro: '“脚本/视频分析”功能允许输入第三方平台 URL。',
          bullets: {
            affiliation: '非关联：与 TikTok、Instagram、YouTube 无商业关联。',
            responsibility: '责任：您需确保使用分析数据不侵犯原作者版权。'
          }
        },
        disclaimer: {
          title: '7. 免责声明',
          intro: '服务按“现状/可用”提供；AI 可能生成错误或不当信息；不作为专业法律、医疗或财务建议；不保证不中断或无错误。'
        },
        liability: {
          title: '8. 责任限制',
          intro: '对于因访问或使用服务导致的任何间接、附带、特殊、后果性或惩罚性损害，我们不承担责任。'
        },
        indemnification: {
          title: '9. 赔偿',
          intro: '您同意就因使用、违反条款或发布内容引起的索赔向 VGOT 及关联方进行赔偿并使其免受损害。'
        },
        termination: {
          title: '10. 终止',
          intro: '如违反条款，我们可立即暂停或终止账户；终止后使用权立即终止。'
        },
        law: {
          title: '11. 适用法律',
          intro: '本条款受英国法律管辖，相关诉讼须在英国法院提起。'
        },
        contact: {
          title: '12. 联系我们',
          intro: '如对本条款有疑问，请联系我们：',
          emailPrefix: '邮箱：'
        }
      }
    },
    nav: {
      home: "首页",
      features: "功能",
      solutions: "解决方案",
      pricing: "价格",
      partner: "推广计划",
      helpCenter: "帮助中心",
      help: "帮助",
      login: "登录",
      startFree: "免费开始",
    },
    hero: {
      badge: "AI 驱动的视频创作平台",
      // Updated to match shouye hero wording
      headline1: "一站式 AI 电商视频工作流",
      headline2: "秒级生成爆款电商视频",
      subheading: "从脚本生成到 HyperSell 视频，再到数字专家讲解——VGOT 一站式处理整个电商视频工作流。",
      ctaPrimary: "免费开始创作",
      ctaSecondary: "查看价格",
      stats: "受到 10,000+ 创作者信赖",
      videosGenerated: "已生成 2,000,000+ 视频",
      sellingPoint1: '免费脚本创作与提取',
      sellingPoint2: '智能一键提示词复制',
      sellingPoint3: '最长10分钟超快视频生成',
      sellingPoint4: 'AI驱动4K画质增强',
    },
    trustLogos: { title: "受领先平台信赖" },
    features: {
      // Updated per request (cards + heading/subheading)
      title: "告别繁琐，用AI彻底革新您的电商视频创作",
      subtitle: "从脚本的想法到视频发布，VGOT 提供您所需的一切。",
      scriptGenerator: { title: "脚本大师", description: "无论是从您的产品描述自动生成，还是智能提取热门视频脚本，VGOT 助您告别文案瓶颈。" },
      soraVideo: { title: "智能提示词", description: "解析视频画面反推视频生成提示词" },
      digitalExpert: { title: "长视频制作", description: "突破短视频时长限制，支持生成最长10分钟的数字人视频，满足您所有深度内容需求。" },
      videoTools: { title: "AI 画质增强", description: "独家AI算法，将低分辨率、模糊视频智能优化为电影级4K画质，让您的作品脱颖而出。" },
    },
    valueProposition: {
      title1: "告别高成本与低效率",
      title2: "让您的每一分投入都超值",
      description: "VGOT 将过去需要数天时间和数千美元成本的工作，转变为几次点击。生成产品视频、脚本和数字讲解员——全部在一个平台上。加入已在扩展电商内容的 10,000+ 创作者。",
      cta: "立即免费体验",
    },
    footer: {
      description: "AI 驱动的病毒式电商视频大规模创作平台。",
      product: "产品",
      support: "支持",
      company: "公司",
      privacy: "隐私政策",
      terms: "服务条款",
      copyright: "© 2025 VGOT. 保留所有权利。",
      features: "功能",
      pricing: "价格",
      contact: "联系我们",
    },
    contact: {
      badge: '联系我们',
      titleLine1: '让我们开始一次',
      titleLine2Gradient: '交流。',
      subtitle: '如果您对我们的企业方案有疑问、需要定制演示，或只是想打个招呼，我们都在这里。',
      generalSupportLabel: '技术与产品支持',
      partnerProgramLabel: '推广合作'
    },
    privacy: {
      title: '隐私政策',
      lastUpdatedPrefix: '最后更新：',
      intro1: '本隐私政策描述了我们在您使用本服务时收集、使用和披露您的信息的政策和程序，并告知您关于隐私权以及相关法律如何保护您。',
      intro2: '我们使用您的个人数据来提供和改进服务。使用本服务即表示您同意按照本隐私政策收集和使用信息。',
      interpretationTitle: '释义与定义',
      interpretation: '释义',
      interpretationText: '首字母大写的词在下述条件下具有特定含义。无论以单数或复数形式出现，这些定义应具有相同含义。',
      definitions: '定义',
      definitionsIntro: '就本隐私政策而言：',
      definitionsList: {
        account: '账户：指为您创建的用于访问我们的服务或部分服务的唯一账户。',
        company: '公司（在本协议中称为“公司”、“我们”、“我方”或“我们的”）指 INFINITE UNIVERSE TECHNOLOGY CO., LTD.',
        cookies: 'Cookies：由网站放置在您的计算机、移动设备或任何其他设备上的小文件，包含浏览历史等信息。',
        country: '国家：英国',
        device: '设备：指任何可访问服务的设备，例如计算机、手机或平板电脑。',
        personalData: '个人数据：指与已识别或可识别的个人相关的任何信息。',
        service: '服务：指网站。',
        serviceProvider: '服务提供商：指代表公司处理数据的任何自然人或法人。',
        usageData: '使用数据：指在使用服务时自动收集的数据，或由服务基础设施本身生成的数据。',
        website: '网站：指 VGOT，访问地址 https://www.vgot.ai',
        you: '您：指访问或使用本服务的个人，或该个人代表其访问或使用本服务的公司或其他法人实体（视情况而定）。'
      },
      collectingTitle: '个人数据的收集与使用',
      typesCollectedTitle: '收集的数据类型',
      personalDataTitle: '个人数据',
      personalDataIntro: '在使用我们的服务时，我们可能会要求您提供某些可用于联系或识别您的个人信息。此类个人信息包括但不限于：',
      personalDataItems: {
        email: '邮箱地址',
        credentials: '账户凭证（安全加密）',
        payment: '支付与账单信息（通过第三方处理器安全处理）',
        usageData: '使用数据'
      },
      userContentTitle: '用户内容',
      userContentIntro: '为提供我们的 AI 生成服务，我们会收集并处理您通过服务上传、输入或生成的内容（“用户内容”），包括但不限于：',
      userContentItems: {
        media: '媒体素材：图片、照片、视频文件和音频录音。',
        text: '文本输入：提示词、脚本、品牌文本以及用于分析的公开 URL。',
        biometric: '类生物特征数据：如果您的用户内容包含人脸图像或语音录音，我们将处理该数据以生成您请求的视频输出。'
      },
      usageDataTitle: '使用数据',
      usageDataIntro: '在使用服务时会自动收集使用数据，例如您的设备 IP 地址、浏览器类型与版本、访问的页面、访问时间和日期、在这些页面上的停留时间、设备标识符以及其他诊断数据。',
      trackingTitle: '跟踪技术与 Cookies',
      trackingIntro: '我们使用 Cookies 和类似的跟踪技术来跟踪服务活动并存储某些信息。',
      trackingItems: {
        necessary: '必要型 Cookies：用于身份验证和安全。',
        functionality: '功能性 Cookies：用于记住您的偏好和设置。',
        analytics: '分析与联盟 Cookies：用于跟踪服务表现并归因合作伙伴推荐。'
      },
      useTitle: '您的个人数据的使用',
      useIntro: '公司可能将个人数据和用户内容用于以下目的：',
      useItems: {
        provide: '提供与维护服务：包括创建您请求的 AI 生成视频、音频和脚本。',
        manageAccount: '管理您的账户：管理您作为服务用户的注册信息。',
        contract: '履行合同：处理您的订阅并确保已购服务的交付。',
        contactYou: '联系您：通过电子邮件提供更新、安全警报或与功能相关的信息通知。',
        improve: '改进与开发服务：识别使用趋势、评估推广活动效果，并改进我们的 AI 算法与机器学习模型。',
        requests: '管理您的请求：受理并处理您向我们的请求。',
        transfers: '业务转移：用于评估或进行并购、剥离、重组、改组、解散或出售或转让部分或全部资产。'
      },
      thirdPartyTitle: '第三方服务提供商',
      thirdPartyIntro: '我们可能聘请第三方公司和个人来协助提供我们的服务（“服务提供商”）、代表我们提供服务或协助分析服务的使用情况。这些第三方仅在履行职责所需范围内访问您的个人数据，并被要求不得用于其他目的或披露。',
      thirdPartyItems: {
        ai: 'AI 处理：我们使用受信任的第三方 AI 模型处理您的用户内容（文本、图像和音频），以生成最终视频输出。',
        payments: '支付：我们使用第三方支付处理器（如 Stripe）进行安全支付处理。我们不会存储您的完整银行卡信息。',
        analytics: '分析：我们可能使用第三方服务提供商来监控和分析服务的使用情况。'
      },
      retentionTitle: '个人数据的保留',
      retentionIntro: '公司仅会在实现本隐私政策所述目的所必需的期间保留您的个人数据和用户内容。',
      retentionItems: {
        account: '账户数据：在您的账户存在期间保留。',
        content: '用户内容：为方便您使用，我们会在您的库中保留您上传的素材（如照片/语音）和生成的输出。为管理存储，我们可能在免费计划用户长期不活跃后删除旧内容。',
        legal: '法律义务：在遵守法律义务、解决争议及执行法律协议与政策的必要范围内保留并使用您的个人数据。'
      },
      transferTitle: '个人数据的传输',
      transferIntro: '您的信息（包括个人数据）会在公司运营办公室以及参与处理的相关方所在地被处理。这意味着该信息可能被传输并存储在位于您所在州、省、国家或其他司法辖区之外的计算机上，那里的数据保护法律可能与您所在司法辖区不同。',
      deleteTitle: '删除您的个人数据',
      deleteIntro: '您有权删除或要求我们协助删除我们已收集的关于您的个人数据。您可随时登录账户管理您的信息（包括生成的视频和上传的素材）。如需永久删除账户及所有相关数据，请通过以下邮箱联系我们：',
      disclosureTitle: '您的个人数据的披露',
      disclosureItems: {
        business: '商业交易：如果公司涉及合并、收购或资产出售，您的个人数据可能会被转移。',
        law: '执法要求：在特定情况下，公司可能依法或应公共机构的有效要求披露您的个人数据。',
        consent: '经您同意：在您的同意下，我们可能为任何其他目的披露您的个人信息。'
      },
      childrenTitle: '儿童隐私',
      childrenIntro: '我们的服务不面向 13 岁以下人士。我们不会有意收集 13 岁以下人士的可识别个人信息。',
      linksTitle: '链接至其他网站',
      linksIntro: '我们的服务可能包含未由我们运营的其他网站链接。如果您点击第三方链接，将会跳转至该第三方网站。我们强烈建议您查看每个访问网站的隐私政策。',
      rightsTitle: '您的数据保护权利（GDPR / 英国 GDPR）',
      rightsIntro: '如果您是英国或欧洲经济区（EEA）居民，您享有某些数据保护权利，包括访问、更正、删除、限制或反对处理您的个人数据的权利。要行使上述任何权利，请通过以下邮箱联系我们：',
      changesTitle: '隐私政策的变更',
      changesIntro: '我们可能不时更新隐私政策。我们将通过在本页面发布新的隐私政策并更新顶部的“最后更新”日期来通知您任何更改。',
      contactTitle: '联系我们',
      contactIntro: '如果您对本隐私政策有任何疑问，您可以通过以下方式联系我们：',
      contactEmailPrefix: '邮箱：'
    },
  },
  "zh-TW": {
    pricing: pricingTranslations["zh-TW"],
    partner: partnerTranslations["zh-TW"],
    credits: creditsTranslations["zh-TW"],
    helpCenter: {
      badge: '支援',
      titleLine1: '幫助中心',
      titleLine2Gradient: '常見問題',
      lastUpdatedPrefix: '最後更新：',
      lastUpdatedDate: '2025年11月26日',
      intro1: '歡迎來到 VGOT 幫助中心。您可以在此了解我們的定價、積分規則以及不同訂閱方案對應的功能限制。',
      intro2Prefix: '若未找到答案，可透過以下信箱聯絡支援團隊',
      tocTitle: '目錄',
      tocItems: {
        item1: '1. 入門與免費試用',
        item2: '2. 積分與消耗規則',
        item3: '3. 訂閱方案與限制',
        item4: '4. 功能指南',
        item5: '5. 推廣計畫與政策'
      },
      sections: {
        gettingStarted: {
          title: '入門與免費試用',
          whatIs: {
            title: '什麼是 VGOT？',
            text: 'VGOT 是一體化 AI 電商影片工作流平台。我們透過 HyperSell（商品轉影片）、Super IP（數位人）、Script Master 等工具，幫助您以秒級速度生成爆款電商影片。'
          },
          freeTrial: {
            title: '是否提供免費試用？',
            text: '是的。註冊免費（體驗）方案後，您將一次性獲得 200 積分以測試工作流。',
            notePrefix: '注意：',
            noteText: '免費方案不包含每月循環積分。使用完 200 積分後，需要升級以繼續生成內容。'
          }
        },
        credits: {
          title: '積分與消耗規則',
          consumption: {
            title: '積分如何消耗？',
            intro: 'VGOT 依據運算成本採用彈性的積分制度，具體如下：',
            items: {
              hypersell: { title: 'HyperSell 影片（短廣告）', text: '每次生成 150 積分。' },
              superip: {
                title: 'Super IP 影片（數位人）',
                points: {
                  p1: '每秒輸出影片消耗 30 積分。',
                  p2: '範例：10 秒數位人影片消耗 300 積分（10×30）。'
                }
              },
              character: {
                title: '角色形象',
                points: {
                  p1: '每張圖片 50 積分（免費與 Creator 方案）。',
                  highlight: '免費不限量',
                  p2: '（Business 與 Enterprise 方案）。'
                }
              },
              voice: {
                title: '聲音建立',
                points: {
                  p1: '每個自訂聲音 3,000 積分（Creator 方案）。',
                  p2Prefix: '首個自訂聲音',
                  p2Highlight: '免費',
                  p2Suffix: '（Business 方案）。'
                }
              },
              hd: { title: '高清強化', text: '每次升級 500 - 800 積分（Business 方案享 40% 折扣）。' }
            }
          },
          expiry: {
            title: '積分是否過期？',
            monthly: { prefix: '• 月訂閱：', text: '是。月度方案內積分在每個結算週期末到期，不可結轉。' },
            yearly: { prefix: '• 年訂閱：', text: '否（年度到期）。年度方案積分在 12 個月週期內有效，未用積分可在年內按月結轉。' },
            extra: { prefix: '• 額外積分包：', text: '否。另購的「額外積分包」在帳戶保持活躍期間不失效。' }
          },
          runOut: { title: '積分用完怎麼辦？', text: '您可以購買額外積分包立即繼續生成，或升級到更高等級方案。' }
        },
        subscription: {
          title: '訂閱方案與限制',
          compare: {
            title: '在哪裡查看不同方案的差異？',
            textPrefix: '請造訪網站上的',
            linkText: '定價頁面',
            textSuffix: '，了解免費、Creator、Business 與 Enterprise 的功能、積分額度與限制的完整比較。'
          },
          change: {
            title: '可以升級/降級方案嗎？',
            intro: '可以，您可在帳戶設定中隨時升級或降級。',
            items: {
              upgrades: { prefix: '升級：', text: '立即生效。' },
              downgrades: { prefix: '降級：', text: '在當前計費週期結束後生效。' }
            }
          }
        },
        features: {
          title: '功能指南',
          hypersell: {
            title: 'HyperSell（電商短影片）',
            whatIs: { title: '什麼是 HyperSell？', text: 'HyperSell 是我們專為商品圖片生成爆款短影片的工具。' },
            points: { costPrefix: '費用：', costText: '每次生成 150 積分。', bestForPrefix: '適用場景：', bestForText: 'TikTok 廣告、Amazon 商品影片、Instagram Reels 等。' }
          },
          superip: {
            title: 'Super IP（長內容數位人）',
            whatIs: { title: '什麼是 Super IP？', text: 'Super IP 可生成逼真的數位人影片，適用於較長內容（Business 方案最高 10 分鐘）。' },
            points: { costPrefix: '費用：', costText: '每秒輸出影片消耗 30 積分。', customizationPrefix: '自訂：', customizationText: '可建立自訂聲音或使用我們預設的高品質聲音。' }
          },
          scriptMaster: {
            title: 'Script Master',
            how: { title: '腳本生成如何運作？' },
            points: {
              freePrefix: '免費方案：',
              freeText: '每日限 50 次腳本生成。',
              paidPrefix: '付費方案：',
              paidText: '腳本生成不限量。',
              extra: '可從熱門影片擷取腳本/提示詞，或根據商品描述自動生成。'
            }
          }
        },
        partner: {
          title: '推廣計畫與政策',
          how: {
            title: '推廣計畫如何運作？',
            intro: '透過推薦創作者加入 VGOT 取得收益。',
            items: {
              commission: { prefix: '佣金：', text: '每個付費訂閱享 30% 持續分潤。' },
              payouts: { prefix: '撥款：', text: '透過 Stripe Connect 自動撥款。' }
            }
          },
          rights: {
            title: '是否擁有商業使用權？',
            items: {
              free: { prefix: '免費方案：', text: '否。內容僅供個人使用/測試。' },
              paid: { prefix: '付費方案（Creator/Business/Enterprise）：', text: '是。您擁有生成影片的完整商業權利，支援無浮水印匯出用於投放與社群媒體。' }
            }
          },
          refund: {
            title: '退款政策',
            items: {
              subscriptions: { prefix: '訂閱：', text: '可隨時取消以停止後續扣款。' },
              credits: { prefix: '積分：', text: '由於 AI 影片生成需要大量 GPU 成本，積分一旦用於生成，一般不予退款。' }
            }
          }
        }
      }
    },
    terms: {
      title: '服務條款',
      lastUpdatedPrefix: '最後更新：',
      intro1: '在使用由 INFINITE UNIVERSE TECHNOLOGY CO., LTD（「VGOT」、「我們」）營運的 VGOT 平台（「服務」）前請仔細閱讀本服務條款（「條款」）。',
      intro2: '存取或使用本服務即表示您同意受本條款約束；若不同意其中任何部分，您將無法繼續使用服務。',
      sections: {
        accounts: {
          title: '1. 帳戶與註冊',
          intro: '欲使用服務之特定功能（工作區、Super IP、推廣計劃等）需註冊帳戶。',
          bullets: {
            accuracy: '準確性：您同意提供準確、最新且完整的註冊資訊。',
            security: '安全：您需妥善保管密碼並對其下所有活動負責。',
            age: '年齡限制：須年滿13歲；若未滿18歲，表示已取得監護人同意。',
            sharing: '帳戶共享：與他人共享帳戶以繞過訂閱限制被禁止，可能導致停權。'
          }
        },
        subscription: {
          title: '2. 訂閱、積分與付款',
          plansTitle: '2.1 訂閱方案',
          plansIntro: 'VGOT 提供免費與付費方案（Creator、Enterprise 等）。',
          plansBullets: {
            billing: '計費：付費方案按月或按年循環預先扣款。',
            cancellation: '取消：可在帳戶設定隨時取消；仍可使用至當期結束。'
          },
          creditsTitle: '2.2 積分與使用政策',
          creditsIntro: '服務採用積分制度（顯示於「Credits & Usage」面板）。',
          creditsBullets: {
            consumption: '消耗：不同操作消耗不同積分；我們保留調整權。',
            expirationMonthly: '月度積分：當期結束失效，不得結轉。',
            expirationExtra: '額外包：按次購買積分只要帳戶保持活躍即不失效。'
          },
          refundTitle: '2.3 退款政策',
          refundBullets: {
            general: '一般規定：除法律強制，所有費用不退款。',
            waiver: '數位內容放棄（英國/EU 用戶）：開始生成即視為放棄14天撤回權。',
            unused: '未使用積分或剩餘週期不予退還。'
          }
        },
        userContent: {
          title: '3. 使用者內容與 AI 生成',
          inputTitle: '3.1 使用者輸入',
          inputIntro: '您保留上傳的文字、圖片、音訊與影片檔（「使用者輸入」）之權利並保證擁有所需授權。',
          featureTitle: '3.2 功能特定政策',
          hypersellBullets: {
            commercial: '商業用途：保證擁有產品、品牌與圖片權利並遵守廣告法規。',
            counterfeits: '禁止仿冒：不得推廣假冒、非法或誤導商品。'
          },
            superipBullets: {
            consent: '嚴格同意：未獲明確書面同意不得上傳第三方照片或語音。',
            biometric: '生物特徵：不得冒充公眾人物或未同意人士。'
          },
          ownershipTitle: '3.3 輸出歸屬',
          ownershipBullets: {
            free: '免費方案：VGOT 保留生成內容所有權；您獲個人非獨占使用許可；我們可展示。',
            paid: '付費方案：遵守條款前提下您擁有生成內容所有權與智慧財產權。'
          }
        },
        partner: {
          title: '4. 推廣合作',
          intro: '若加入 VGOT 推廣合作計劃：',
          bullets: {
            commission: '佣金：合格銷售可獲循環分潤。',
            payouts: '付款：透過 Stripe Connect 結算，需提供正確稅務與銀行資訊。',
            prohibited: '禁止行為：自購返佣、競價品牌字、垃圾訊息或誤導廣告將停權並沒收佣金。'
          }
        },
        acceptable: {
          title: '5. 合理使用與禁止內容',
          intro: '您同意不利用服務生成、上傳或分享以下內容：',
          prohibitedList: {
            illegal: '違法內容：違反法律（如兒童剝削、非法行為）。',
            sexual: '性露骨：包含裸體、色情或性露骨材料。',
            hate: '仇恨與騷擾：鼓動暴力、歧視或仇恨。',
            deepfakes: '深度偽造與虛假：誤導、散布假資訊或未同意冒充。',
            selfHarm: '自我傷害：鼓勵自殘、自殺或飲食失調。',
            ip: '侵權：侵犯著作權、商標或隱私權。'
          },
          platformTitle: '平台限制：',
          platformBullets: {
            scripts: '禁止自動腳本/機器人抓取。',
            reverse: '禁止逆向工程或嘗試提取模型權重。',
            compete: '禁止利用服務打造競爭產品。'
          }
        },
        analysis: {
          title: '6. 影片分析與第三方連結',
          intro: '「腳本/分析影片」功能允許輸入第三方平台 URL。',
          bullets: {
            affiliation: '非關聯：與 TikTok、Instagram、YouTube 無商業關係。',
            responsibility: '責任：需確保分析資料使用不侵犯原作者著作權。'
          }
        },
        disclaimer: {
          title: '7. 免責聲明',
          intro: '服務以「現狀/可用」提供；AI 可能產生錯誤或不當內容；不作為專業建議；不保證不中斷或無錯。'
        },
        liability: {
          title: '8. 責任限制',
          intro: '對任何間接、附帶、特殊、後果性或懲罰性損害不承擔責任。'
        },
        indemnification: {
          title: '9. 賠償',
          intro: '您同意就因使用、違反條款或發布內容產生的索賠向 VGOT 賠償並使其免受損害。'
        },
        termination: {
          title: '10. 終止',
          intro: '如違反條款我們可立即終止帳戶；終止後使用權立即消失。'
        },
        law: {
          title: '11. 適用法律',
          intro: '本條款受英國法律管轄；相關訴訟須於英國法院提起。'
        },
        contact: {
          title: '12. 聯絡我們',
          intro: '若對本條款有疑問請聯絡：',
          emailPrefix: '電子郵件：'
        }
      }
    },
    nav: {
      home: "首頁",
      features: "功能",
      solutions: "解決方案",
      pricing: "價格",
      partner: "推廣計劃",
      helpCenter: "幫助中心",
      help: "幫助",
      login: "登入",
      startFree: "免費開始",
    },
    hero: {
      badge: "AI 驅動的影片創作平台",
      // Updated to match shouye hero wording (Traditional Chinese)
      headline1: "一站式 AI 電商影片工作流",
      headline2: "秒級生成爆款電商影片",
      subheading: "從腳本生成到 HyperSell 影片，再到數位專家講解——VGOT 一站式處理整個電商影片工作流。",
      ctaPrimary: "免費開始創作",
      ctaSecondary: "查看價格",
      stats: "受到 10,000+ 創作者信賴",
      videosGenerated: "已生成 2,000,000+ 影片",
      sellingPoint1: '免費腳本創作與提取',
      sellingPoint2: '智能一鍵提示詞複製',
      sellingPoint3: '最長10分鐘超快影片生成',
      sellingPoint4: 'AI驅動4K畫質增強',
    },
    trustLogos: { title: "受領先平台信賴" },
    features: {
      title: "告別繁瑣，用AI徹底革新您的電商影片創作",
      subtitle: "從腳本的想法到影片發布，VGOT 提供您所需的一切。",
      scriptGenerator: { title: "腳本大師", description: "無論是從您的產品描述自動生成，還是智能提取熱門影片腳本，VGOT 助您告別文案瓶頸。" },
      soraVideo: { title: "智能提示詞", description: "智能分析，精準提取影片生成背後的關鍵詞提示詞，讓您輕鬆複製成功經驗，不再盲目創作。" },
      digitalExpert: { title: "長影片製作", description: "突破短影片時長限制，支持生成最長10分鐘的數字人影片，滿足您所有深度內容需求。" },
      videoTools: { title: "AI 畫質增強", description: "獨家AI算法，將低分辨率、模糊影片智能優化為電影級4K畫質，讓您的作品脫穎而出。" },
    },
    valueProposition: {
      title1: "不再為每支影片",
      title2: "支付數百美元",
      description: "VGOT 將過去需數天與高額成本的工作，轉化為幾次點擊。產品影片、腳本、數位講解員一次到位。加入 10,000+ 正在擴展電商內容的創作者。",
      cta: "立即開始",
    },
    footer: {
      description: "AI 驅動的病毒式電商影片規模化創作平台。",
      product: "產品",
      support: "支援",
      company: "公司",
      privacy: "隱私政策",
      terms: "服務條款",
      copyright: "© 2025 VGOT. 保留所有權利。",
      features: "功能",
      pricing: "價格",
      contact: "聯絡我們",
    },
      contact: {
        badge: '聯繫我們',
        titleLine1: '讓我們開始一次',
        titleLine2Gradient: '交流。',
        subtitle: '若您對企業方案有疑問、需要客製化演示，或只是想打聲招呼，我們都在這裡。',
        generalSupportLabel: '技術與產品支援',
        partnerProgramLabel: '推廣合作'
      },
      privacy: {
        title: '隱私政策',
        lastUpdatedPrefix: '最後更新：',
        intro1: '本隱私政策描述了我們在您使用本服務時收集、使用和披露您的資訊的政策和程序，並告知您隱私權以及相關法律如何保護您。',
        intro2: '我們使用您的個人資料來提供和改進服務。使用本服務即表示您同意依本隱私政策收集與使用資訊。',
        interpretationTitle: '詮釋與定義',
        interpretation: '詮釋',
        interpretationText: '首字母大寫的詞語在以下條件下具有特定意義。無論以單數或複數形式出現，這些定義皆具有相同意義。',
        definitions: '定義',
        definitionsIntro: '就本隱私政策而言：',
        definitionsList: {
          account: '帳戶：指為您建立的用於存取我們服務或部分服務的唯一帳戶。',
          company: '公司（在本協議中稱為「公司」、「我們」、「我方」或「我們的」）指 INFINITE UNIVERSE TECHNOLOGY CO., LTD.',
          cookies: 'Cookies：由網站放置在您的電腦、行動裝置或其他裝置上的小檔案，包含瀏覽歷史等資訊。',
          country: '國家：英國',
          device: '裝置：指任何可存取服務的裝置，例如電腦、手機或平板。',
          personalData: '個人資料：指與已識別或可識別之個人相關的任何資訊。',
          service: '服務：指網站。',
          serviceProvider: '服務提供者：指代表公司處理資料的任何自然人或法人。',
          usageData: '使用資料：指在使用服務時自動收集，或由服務基礎設施本身所產生的資料。',
          website: '網站：指 VGOT，網址 https://www.vgot.ai',
          you: '您：指存取或使用本服務的個人，或該個人代表其存取或使用本服務的公司或其他法人實體（視情況而定）。'
        },
        collectingTitle: '個人資料的收集與使用',
        typesCollectedTitle: '收集的資料類型',
        personalDataTitle: '個人資料',
        personalDataIntro: '在使用我們的服務時，我們可能要求您提供可用於聯絡或識別您的某些個人資訊。此類個人資訊包括但不限於：',
        personalDataItems: {
          email: '電子郵件地址',
          credentials: '帳戶憑證（安全加密）',
          payment: '付款與帳務資訊（透過第三方處理器安全處理）',
          usageData: '使用資料'
        },
        userContentTitle: '使用者內容',
        userContentIntro: '為提供我們的 AI 生成服務，我們會收集並處理您透過服務上傳、輸入或生成的內容（「使用者內容」），包括但不限於：',
        userContentItems: {
          media: '媒體素材：圖片、照片、影片檔與音訊錄音。',
          text: '文字輸入：提示詞、腳本、品牌文字與用於分析的公開 URL。',
          biometric: '類生物特徵資料：若您的使用者內容包含臉部影像或語音錄音，我們會處理該資料以生成您所要求的影片輸出。'
        },
        usageDataTitle: '使用資料',
        usageDataIntro: '在使用服務時會自動收集使用資料，例如您的裝置 IP 位址、瀏覽器類型與版本、造訪的頁面、造訪時間與日期、在這些頁面上的停留時間、裝置識別碼以及其他診斷資料。',
        trackingTitle: '追蹤技術與 Cookies',
        trackingIntro: '我們使用 Cookies 與類似的追蹤技術來追蹤服務活動並儲存特定資訊。',
        trackingItems: {
          necessary: '必要型 Cookies：用於身分驗證與安全。',
          functionality: '功能性 Cookies：用於記住您的偏好與設定。',
          analytics: '分析與聯盟 Cookies：用於追蹤服務表現並歸因合作夥伴推薦。'
        },
        useTitle: '您的個人資料的使用',
        useIntro: '公司可能將個人資料與使用者內容用於以下目的：',
        useItems: {
          provide: '提供與維護服務：包括建立您所要求的 AI 生成影片、音訊與腳本。',
          manageAccount: '管理您的帳戶：管理您作為服務使用者的註冊資訊。',
          contract: '履行合約：處理您的訂閱並確保已購服務的交付。',
          contactYou: '聯絡您：透過電子郵件提供更新、安全警示或與功能相關的資訊通知。',
          improve: '改進與開發服務：識別使用趨勢、評估推廣活動成效，並改進我們的 AI 演算法與機器學習模型。',
          requests: '管理您的請求：受理並處理您向我們的請求。',
          transfers: '企業轉移：用於評估或進行併購、剝離、重組、改組、解散或出售或轉讓部分或全部資產。'
        },
        thirdPartyTitle: '第三方服務提供者',
        thirdPartyIntro: '我們可能僱用第三方公司與個人來協助提供我們的服務（「服務提供者」）、代表我們提供服務或協助分析服務的使用情形。這些第三方僅在履行職責所需範圍內存取您的個人資料，並被要求不得用於其他目的或揭露。',
        thirdPartyItems: {
          ai: 'AI 處理：我們使用受信任的第三方 AI 模型處理您的使用者內容（文字、影像與音訊），以生成最終影片輸出。',
          payments: '付款：我們使用第三方付款處理器（如 Stripe）進行安全付款處理。我們不會儲存您的完整信用卡資料。',
          analytics: '分析：我們可能使用第三方服務提供者來監控與分析服務的使用情形。'
        },
        retentionTitle: '個人資料的保存',
        retentionIntro: '公司僅會在達成本隱私政策所述目的所必需的期間保存您的個人資料與使用者內容。',
        retentionItems: {
          account: '帳戶資料：於您的帳戶存續期間保存。',
          content: '使用者內容：為方便您使用，我們會在您的資料庫中保存您上傳的素材（如照片/語音）與生成的輸出。為管理儲存，我們可能在免費方案使用者長期不活躍後刪除舊內容。',
          legal: '法律義務：在遵守法律義務、解決爭議及執行法律協議與政策的必要範圍內保存並使用您的個人資料。'
        },
        transferTitle: '個人資料的傳輸',
        transferIntro: '您的資訊（包括個人資料）會在公司營運辦公室以及參與處理的相關方所在地被處理。這表示該資訊可能被傳輸並維護於位於您所在州、省、國家或其他司法管轄區之外的電腦上，那裡的資料保護法律可能與您所在司法管轄區不同。',
        deleteTitle: '刪除您的個人資料',
        deleteIntro: '您有權刪除或要求我們協助刪除我們已收集的關於您的個人資料。您可隨時登入帳戶管理您的資訊（包括生成的影片與上傳的素材）。若需永久刪除帳戶及所有相關資料，請透過以下電子郵件聯絡我們：',
        disclosureTitle: '您的個人資料的揭露',
        disclosureItems: {
          business: '商業交易：若公司涉及併購、收購或資產出售，您的個人資料可能會被轉移。',
          law: '執法要求：在特定情況下，公司可能依法或應公共機構的有效要求揭露您的個人資料。',
          consent: '經您同意：在您的同意下，我們可能為任何其他目的揭露您的個人資訊。'
        },
        childrenTitle: '兒童隱私',
        childrenIntro: '本服務不面向 13 歲以下人士。我們不會刻意收集 13 歲以下人士的可識別個人資訊。',
        linksTitle: '連結至其他網站',
        linksIntro: '本服務可能包含未由我們營運的其他網站連結。若您點擊第三方連結，將導向至該第三方網站。我們強烈建議您查看每個造訪網站的隱私政策。',
        rightsTitle: '您的資料保護權利（GDPR / 英國 GDPR）',
        rightsIntro: '若您是英國或歐洲經濟區（EEA）居民，您享有特定的資料保護權利，包括存取、更正、刪除、限制或反對處理您的個人資料的權利。要行使上述任何權利，請透過以下電子郵件聯絡我們：',
        changesTitle: '隱私政策的變更',
        changesIntro: '我們可能不時更新隱私政策。我們將透過在本頁面發布新的隱私政策並更新頂部的「最後更新」日期來通知您任何變更。',
        contactTitle: '聯繫我們',
        contactIntro: '若您對本隱私政策有任何疑問，您可以透過以下方式聯繫我們：',
        contactEmailPrefix: '電子郵件：'
      },
  },
  es: {
    pricing: pricingTranslations.es,
    partner: partnerTranslations.es,
    credits: creditsTranslations.es,
    helpCenter: {
      badge: 'Soporte',
      titleLine1: 'Centro de Ayuda',
      titleLine2Gradient: 'FAQ',
      lastUpdatedPrefix: 'Última actualización:',
      lastUpdatedDate: '26 de noviembre de 2025',
      intro1: 'Bienvenido al Centro de Ayuda de VGOT. Aquí encontrarás respuestas sobre nuestros precios, el sistema de créditos y los límites de funciones según tu plan de suscripción.',
      intro2Prefix: 'Si no encuentras la respuesta que buscas, contacta a nuestro equipo de soporte en',
      tocTitle: 'Tabla de Contenidos',
      tocItems: {
        item1: '1. Primeros Pasos y Prueba Gratuita',
        item2: '2. Créditos y Reglas de Consumo',
        item3: '3. Planes de Suscripción y Límites',
        item4: '4. Guía de Funciones',
        item5: '5. Programa de Socios y Políticas'
      },
      sections: {
        gettingStarted: {
          title: 'Primeros Pasos y Prueba Gratuita',
          whatIs: {
            title: '¿Qué es VGOT?',
            text: 'VGOT es una plataforma integral de flujo de trabajo de video para comercio electrónico impulsada por IA. Te ayudamos a crear videos virales en segundos con herramientas como HyperSell (producto a video), Super IP (avatares digitales) y Script Master.'
          },
          freeTrial: {
            title: '¿Hay prueba gratuita?',
            text: 'Sí. Al registrarte en el plan Gratuito (Experiencia), recibes un bono único de 200 créditos para probar el flujo de trabajo.',
            notePrefix: 'Nota:',
            noteText: 'El plan Gratuito no incluye créditos mensuales recurrentes. Una vez utilizados los 200 créditos, deberás actualizar para seguir generando contenido.'
          }
        },
        credits: {
          title: 'Créditos y Reglas de Consumo',
          consumption: {
            title: '¿Cómo se consumen los créditos?',
            intro: 'VGOT utiliza un sistema flexible de créditos basado en los costos de cómputo. Desglose:',
            items: {
              hypersell: { title: 'Video HyperSell (Anuncios Cortos)', text: '150 créditos por generación de video.' },
              superip: {
                title: 'Video Super IP (Humano Digital)',
                points: {
                  p1: '30 créditos por segundo de duración del video.',
                  p2: 'Ejemplo: Un video de avatar digital de 10 segundos cuesta 300 créditos (10 × 30).'
                }
              },
              character: {
                title: 'Imagen de Personaje',
                points: {
                  p1: '50 créditos por imagen (Planes Gratuito y Creator).',
                  highlight: 'GRATIS Ilimitado',
                  p2: '(Planes Business y Enterprise).'
                }
              },
              voice: {
                title: 'Creación de Voz',
                points: {
                  p1: '3.000 créditos por voz personalizada (Plan Creator).',
                  p2Prefix: 'La primera voz personalizada es',
                  p2Highlight: 'GRATIS',
                  p2Suffix: '(Plan Business).'
                }
              },
              hd: { title: 'Mejora HD', text: '500 - 800 créditos por mejora de video (El plan Business obtiene un 40% de descuento).' }
            }
          },
          expiry: {
            title: '¿Mis créditos caducan?',
            monthly: { prefix: '• Suscripción Mensual:', text: 'Sí. Los créditos incluidos en un plan mensual caducan al final del mes de facturación y no se acumulan.' },
            yearly: { prefix: '• Suscripción Anual:', text: 'No (Caducidad anual). Los créditos incluidos en un plan anual son válidos durante todo el ciclo de 12 meses. Los no utilizados se acumulan mes a mes hasta el final del año de suscripción.' },
            extra: { prefix: '• Paquetes de Créditos Extra:', text: 'No. Los créditos comprados por separado como "Paquetes Extra" no caducan mientras tu cuenta permanezca activa.' }
          },
          runOut: { title: '¿Qué sucede si me quedo sin créditos?', text: 'Puedes comprar un paquete adicional de créditos para continuar inmediatamente o actualizar tu plan a un nivel superior.' }
        },
        subscription: {
          title: 'Planes de Suscripción y Límites',
          compare: {
            title: '¿Dónde puedo ver las diferencias entre planes?',
            textPrefix: 'Visita nuestra',
            linkText: 'Página de Precios',
            textSuffix: 'para una comparación completa de funciones, asignaciones de créditos y límites para los planes Gratuito, Creator, Business y Enterprise.'
          },
          change: {
            title: '¿Puedo subir/bajar de plan?',
            intro: 'Sí, puedes actualizar o degradar tu plan en cualquier momento desde la configuración de tu cuenta.',
            items: {
              upgrades: { prefix: 'Actualizaciones:', text: 'Surten efecto inmediatamente.' },
              downgrades: { prefix: 'Degradaciones:', text: 'Surten efecto al final del ciclo de facturación actual.' }
            }
          }
        },
        features: {
          title: 'Guía de Funciones',
          hypersell: {
            title: 'HyperSell (Videos de E-Commerce)',
            whatIs: { title: '¿Qué es HyperSell?', text: 'HyperSell es nuestra herramienta especializada para crear videos cortos y virales de comercio electrónico a partir de imágenes de productos.' },
            points: { costPrefix: 'Costo:', costText: '150 créditos por generación.', bestForPrefix: 'Ideal para:', bestForText: 'Anuncios de TikTok, videos de productos de Amazon e Instagram Reels.' }
          },
          superip: {
            title: 'Super IP (Avatar Digital de Larga Duración)',
            whatIs: { title: '¿Qué es Super IP?', text: 'Super IP te permite generar videos de humanos digitales realistas para contenido más largo (hasta 10 min en el plan Business).' },
            points: { costPrefix: 'Costo:', costText: '30 créditos por segundo de video generado.', customizationPrefix: 'Personalización:', customizationText: 'Puedes crear tu propia voz personalizada o usar nuestras voces preestablecidas de alta calidad.' }
          },
          scriptMaster: {
            title: 'Script Master',
            how: { title: '¿Cómo funciona la generación de guiones?' },
            points: {
              freePrefix: 'Plan Gratuito:',
              freeText: 'Limitado a 50 generaciones de guiones por día.',
              paidPrefix: 'Planes de Pago:',
              paidText: 'Generación de guiones ilimitada.',
              extra: 'Puedes extraer guiones/prompts de videos en tendencia o generarlos automáticamente a partir de descripciones de productos.'
            }
          }
        },
        partner: {
          title: 'Programa de Socios y Políticas',
          how: {
            title: '¿Cómo funciona el Programa de Socios?',
            intro: 'Gana ingresos recomendando creadores a VGOT.',
            items: {
              commission: { prefix: 'Comisión:', text: '30% de comisión recurrente por cada suscripción de pago.' },
              payouts: { prefix: 'Pagos:', text: 'Automatizados a través de Stripe Connect.' }
            }
          },
          rights: {
            title: '¿Obtengo derechos comerciales?',
            items: {
              free: { prefix: 'Plan Gratuito:', text: 'No. El contenido es solo para uso personal/pruebas.' },
              paid: { prefix: 'Planes de Pago (Creator/Business/Enterprise):', text: 'Sí. Tienes derechos comerciales completos sobre los videos generados, incluido exportación sin marca de agua para publicidad y redes sociales.' }
            }
          },
          refund: {
            title: 'Política de Reembolso',
            items: {
              subscriptions: { prefix: 'Suscripciones:', text: 'Puedes cancelar en cualquier momento para detener la facturación futura.' },
              credits: { prefix: 'Créditos:', text: 'Dado que la generación de video AI consume costos significativos de GPU, los créditos generalmente no son reembolsables una vez usados.' }
            }
          }
        }
      }
    },
    terms: {
      title: 'Términos de Servicio',
      lastUpdatedPrefix: 'Última actualización:',
      intro1: 'Lee estos Términos de Servicio ("Términos") cuidadosamente antes de usar la plataforma VGOT (el "Servicio") operada por INFINITE UNIVERSE TECHNOLOGY CO., LTD ("VGOT", "nosotros").',
      intro2: 'Al acceder o usar el Servicio, aceptas estar sujeto a estos Términos. Si no estás de acuerdo con alguna parte, no podrás acceder al Servicio.',
      sections: {
        accounts: {
          title: '1. Cuentas y Registro',
          intro: 'Para acceder a ciertas funciones (Workspace, Super IP o Programa de Socios) debes registrar una cuenta.',
          bullets: {
            accuracy: 'Exactitud: Aceptas proporcionar información precisa, actual y completa durante el registro.',
            security: 'Seguridad: Eres responsable de proteger la contraseña y actividades bajo ella.',
            age: 'Edad: Debes tener al menos 13 años; si eres menor de 18 confirmas tener permiso de tu tutor.',
            sharing: 'Compartir Cuenta: Compartir credenciales para eludir límites de suscripción está prohibido y puede suspender la cuenta.'
          }
        },
        subscription: {
          title: '2. Suscripción, Créditos y Pagos',
          plansTitle: '2.1 Planes de Suscripción',
          plansIntro: 'VGOT ofrece planes gratuitos y de pago (Creator, Enterprise).',
          plansBullets: {
            billing: 'Facturación: Las suscripciones de pago se facturan por adelantado de forma periódica (mensual o anual).',
            cancellation: 'Cancelación: Puedes cancelar en cualquier momento; permanece activo hasta el final del ciclo actual.'
          },
          creditsTitle: '2.2 Política de Créditos y Uso',
          creditsIntro: 'El Servicio funciona con sistema de créditos (panel "Credits & Usage").',
          creditsBullets: {
            consumption: 'Consumo: Acciones diferentes gastan créditos distintos; podemos ajustar costes en cualquier momento.',
            expirationMonthly: 'Créditos Mensuales: Expiran al final del ciclo y no se acumulan.',
            expirationExtra: 'Paquetes Extra: Créditos comprados adicionales no expiran mientras la cuenta esté activa.'
          },
          refundTitle: '2.3 Política de Reembolsos',
          refundBullets: {
            general: 'Regla General: Salvo ley aplicable, todas las tarifas no son reembolsables.',
            waiver: 'Renuncia de Contenido Digital (Clientes UK/EU): Al comenzar a generar contenido renuncias al derecho de desistimiento.',
            unused: 'Sin reembolso por créditos no usados ni períodos parciales.'
          }
        },
        userContent: {
          title: '3. Contenido del Usuario y Generación IA',
          inputTitle: '3.1 Entrada del Usuario',
          inputIntro: 'Conservas derechos sobre prompts, imágenes, audio y video que subas ("Entrada del Usuario"). Garantizas tener derechos necesarios.',
          featureTitle: '3.2 Políticas Específicas',
          hypersellBullets: {
            commercial: 'Uso Comercial: Debes tener derechos sobre productos, marcas e imágenes y cumplir leyes publicitarias.',
            counterfeits: 'Sin Falsificaciones: Prohibido promover productos ilegales o engañosos.'
          },
          superipBullets: {
            consent: 'Consentimiento Estricto: No subir fotos o voces de terceros sin consentimiento escrito.',
            biometric: 'Datos Biométricos: No suplantar figuras públicas ni individuos sin consentimiento.'
          },
          ownershipTitle: '3.3 Propiedad de Salidas',
          ownershipBullets: {
            free: 'Usuarios Gratis: VGOT conserva propiedad; licencia personal limitada. Podemos mostrar contenido generado.',
            paid: 'Usuarios de Pago: Conservas plena propiedad e IP de contenido generado mientras cumples los Términos.'
          }
        },
        partner: {
          title: '4. Programa de Socios',
          intro: 'Si te unes al Programa de Socios:',
          bullets: {
            commission: 'Comisión: Obtén comisiones recurrentes por ventas calificadas.',
            payouts: 'Pagos: Procesados vía Stripe Connect; provee datos fiscales y bancarios correctos.',
            prohibited: 'Conducta Prohibida: Auto-referencias, pujas de palabras de marca, spam o publicidad engañosa causan bloqueo inmediato.'
          }
        },
        acceptable: {
          title: '5. Uso Aceptable y Contenido Prohibido',
          intro: 'Aceptas NO usar el Servicio para generar, subir o compartir contenido que:',
          prohibitedList: {
            illegal: 'Contenido Ilegal: Viola leyes aplicables.',
            sexual: 'Sexualmente Explícito: Incluye desnudos o material pornográfico.',
            hate: 'Discurso de Odio o Acoso: Promueve violencia o discriminación.',
            deepfakes: 'Deepfakes y Desinformación: Engaña, difunde noticias falsas o suplanta sin consentimiento.',
            selfHarm: 'Autolesión: Promueve autolesión o suicidio.',
            ip: 'Infracción de Propiedad Intelectual.'
          },
          platformTitle: 'Restricciones de Plataforma:',
          platformBullets: {
            scripts: 'Sin scripts/bots automatizados.',
            reverse: 'Sin ingeniería inversa ni extracción de modelos.',
            compete: 'No construir producto competidor con el Servicio.'
          }
        },
        analysis: {
          title: '6. Análisis de Video y Enlaces de Terceros',
          intro: 'Las funciones "Scripts" y "Analyze Video" permiten URLs externas.',
          bullets: {
            affiliation: 'Sin Afiliación: No afiliados con TikTok, Instagram, YouTube.',
            responsibility: 'Responsabilidad: Asegura no infringir derechos de autores originales.'
          }
        },
        disclaimer: {
          title: '7. Exención de Garantías',
          intro: 'Servicio proporcionado "TAL CUAL". IA puede generar info incorrecta/ofensiva. No es consejo profesional.'
        },
        liability: {
          title: '8. Limitación de Responsabilidad',
          intro: 'No somos responsables de daños indirectos, especiales o punitivos incluyendo pérdida de datos o beneficios.'
        },
        indemnification: {
          title: '9. Indemnización',
          intro: 'Aceptas indemnizar y mantener indemne a VGOT por reclamaciones derivadas de tu uso o incumplimiento.'
        },
        termination: {
          title: '10. Terminación',
          intro: 'Podemos suspender o terminar cuentas por incumplimiento; cesan derechos de uso.'
        },
        law: {
          title: '11. Ley Aplicable',
          intro: 'Términos regidos por leyes del Reino Unido; acciones en tribunales del Reino Unido.'
        },
        contact: {
          title: '12. Contáctanos',
          intro: 'Preguntas sobre estos Términos:',
          emailPrefix: 'Por correo:'
        }
      }
    },
    nav: {
      home: 'Inicio',
      features: 'Características',
      solutions: 'Soluciones',
      pricing: 'Precios',
      partner: 'Programa de Socios',
      helpCenter: 'Centro de Ayuda',
      help: 'Ayuda',
      login: 'Iniciar sesión',
      startFree: 'Comenzar gratis',
    },
    hero: {
      badge: 'Plataforma de Creación de Video con IA',
      headline1: 'Crea videos virales de e-commerce',
      headline2: 'en segundos',
      subheading: 'Desde la copia de guiones hasta la generación de videos HyperSell y la narración de expertos digitales—VGOT maneja todo tu flujo de trabajo de videos de e-commerce.',
      ctaPrimary: 'Comenzar gratis',
      ctaSecondary: 'Ver precios',
      stats: 'Confiado por más de 10,000 creadores',
      videosGenerated: 'Más de 2M de videos generados',
      sellingPoint1: 'Creación y extracción de guiones gratis',
      sellingPoint2: 'Duplicación inteligente de prompts con un clic',
      sellingPoint3: 'Generación de video ultrarrápida de hasta 10 min',
      sellingPoint4: 'Mejora de calidad 4K impulsada por IA',
    },
    trustLogos: { title: 'Confiado por plataformas líderes' },
    features: {
      title: 'Dígale adiós a la complejidad: revolucione la creación de videos de comercio electrónico con IA',
      subtitle: 'Desde la idea del guion hasta la publicación del video, VGOT le ofrece todo lo que necesita.',
      scriptGenerator: { title: 'Maestro de guiones', description: 'Ya sea generando automáticamente a partir de descripciones de productos o extrayendo inteligentemente guiones de videos virales, VGOT le ayuda a superar el bloqueo del escritor.' },
      soraVideo: { title: 'Prompt inteligente', description: 'Analice inteligentemente y extraiga con precisión los prompts clave detrás de la generación de videos, permitiéndole replicar el éxito fácilmente sin prueba y error.' },
      digitalExpert: { title: 'Creador de videos largos', description: 'Rompa los límites de tiempo de los videos cortos: admite la generación de videos de humanos digitales de hasta 10 minutos para satisfacer todas sus necesidades de contenido profundo.' },
      videoTools: { title: 'Mejora de calidad con IA', description: 'El algoritmo exclusivo de IA transforma instantáneamente videos borrosos y de baja resolución en calidad 4K de nivel cinematográfico, haciendo que su trabajo destaque.' },
    },
    valueProposition: {
      title1: 'Dígale adiós a los altos costos y la baja eficiencia',
      title2: 'Haga que cada inversión cuente',
      description: 'VGOT convierte lo que solía tomar días y costar miles en unos pocos clics. Genere videos de productos, guiones y narradores digitales, todo en una sola plataforma. Únase a más de 10,000 creadores que ya están escalando su contenido de comercio electrónico.',
      cta: 'Pruébelo gratis ahora',
    },
    footer: {
      description: 'Plataforma impulsada por IA para crear videos virales de e-commerce a escala.',
      product: 'Producto',
      support: 'Soporte',
      company: 'Empresa',
      privacy: 'Política de Privacidad',
      terms: 'Términos de Servicio',
      copyright: '© 2025 VGOT. Todos los derechos reservados.',
      features: 'Características',
      pricing: 'Precios',
      contact: 'Contacto',
    },
    contact: {
      badge: 'CONTÁCTANOS',
      titleLine1: 'Comencemos una',
      titleLine2Gradient: 'conversación.',
      subtitle: 'Si tienes preguntas sobre nuestros planes Enterprise, necesitas una demo personalizada o simplemente quieres saludar, estamos aquí para ayudarte.',
      generalSupportLabel: 'Soporte general',
      partnerProgramLabel: 'Programa de socios'
    },
    privacy: {
      title: 'Política de Privacidad',
      lastUpdatedPrefix: 'Última actualización:',
      intro1: 'Esta Política de Privacidad describe nuestras políticas y procedimientos sobre la recopilación, el uso y la divulgación de tu información cuando utilizas el Servicio y te informa sobre tus derechos de privacidad y cómo la ley te protege.',
      intro2: 'Usamos tus datos personales para proporcionar y mejorar el Servicio. Al usar el Servicio, aceptas la recopilación y el uso de la información de acuerdo con esta Política de Privacidad.',
      interpretationTitle: 'Interpretación y Definiciones',
      interpretation: 'Interpretación',
      interpretationText: 'Las palabras cuya letra inicial está en mayúscula tienen significados definidos bajo las siguientes condiciones. Las siguientes definiciones tendrán el mismo significado independientemente de si aparecen en singular o en plural.',
      definitions: 'Definiciones',
      definitionsIntro: 'Para los fines de esta Política de Privacidad:',
      definitionsList: {
        account: 'Cuenta significa una cuenta única creada para que accedas a nuestro Servicio o a partes de nuestro Servicio.',
        company: 'Compañía (referida como "la Compañía", "Nosotros" o "Nuestro") se refiere a INFINITE UNIVERSE TECHNOLOGY CO., LTD.',
        cookies: 'Las Cookies son archivos pequeños que se colocan en tu ordenador, dispositivo móvil u otro dispositivo por un sitio web, y contienen detalles de tu historial de navegación entre otros usos.',
        country: 'País se refiere a: Reino Unido',
        device: 'Dispositivo significa cualquier dispositivo que pueda acceder al Servicio como un ordenador, un teléfono móvil o una tableta digital.',
        personalData: 'Datos Personales es cualquier información que se relaciona con un individuo identificado o identificable.',
        service: 'Servicio se refiere al Sitio Web.',
        serviceProvider: 'Proveedor de Servicios significa cualquier persona física o jurídica que procesa los datos en nombre de la Compañía.',
        usageData: 'Datos de Uso se refiere a los datos recopilados automáticamente, generados por el uso del Servicio o de la infraestructura del Servicio en sí.',
        website: 'Sitio Web se refiere a VGOT, accesible desde https://www.vgot.ai',
        you: 'Tú significa el individuo que accede o utiliza el Servicio, o la empresa u otra entidad legal en nombre de la cual dicho individuo accede o usa el Servicio, según corresponda.'
      },
      collectingTitle: 'Recopilación y Uso de tus Datos Personales',
      typesCollectedTitle: 'Tipos de Datos Recopilados',
      personalDataTitle: 'Datos Personales',
      personalDataIntro: 'Mientras usas nuestro Servicio, podemos pedirte que nos proporciones cierta información personal identificable que puede usarse para contactarte o identificarte. La información personal identificable puede incluir, entre otros:',
      personalDataItems: {
        email: 'Dirección de correo electrónico',
        credentials: 'Credenciales de la cuenta (cifradas de forma segura)',
        payment: 'Información de pago y facturación (procesada de forma segura a través de terceros)',
        usageData: 'Datos de Uso'
      },
      userContentTitle: 'Contenido del Usuario',
      userContentIntro: 'Para proporcionar nuestros servicios de generación con IA, recopilamos y procesamos el contenido que subes, ingresas o generas a través del Servicio ("Contenido del Usuario"). Esto incluye, entre otros:',
      userContentItems: {
        media: 'Recursos Multimedia: Imágenes, fotografías, archivos de video y grabaciones de audio.',
        text: 'Entradas de Texto: Prompts, guiones, texto de marca y URLs públicas proporcionadas para análisis.',
        biometric: 'Datos similares biométricos: Si tu contenido contiene imágenes faciales o grabaciones de voz, procesamos estos datos para generar la salida solicitada.'
      },
      usageDataTitle: 'Datos de Uso',
      usageDataIntro: 'Los Datos de Uso se recopilan automáticamente al usar el Servicio. Pueden incluir la dirección IP de tu dispositivo, tipo y versión del navegador, las páginas que visitas, fecha y hora de tu visita, tiempo en esas páginas, identificadores de dispositivo y otros datos de diagnóstico.',
      trackingTitle: 'Tecnologías de Rastreo y Cookies',
      trackingIntro: 'Usamos Cookies y tecnologías de rastreo similares para rastrear la actividad en nuestro Servicio y almacenar cierta información.',
      trackingItems: {
        necessary: 'Cookies Necesarias: Esenciales para autenticación y seguridad.',
        functionality: 'Cookies de Funcionalidad: Para recordar tus preferencias y configuraciones.',
        analytics: 'Cookies de Analítica y Afiliados: Para rastrear el rendimiento y atribuir referencias de socios.'
      },
      useTitle: 'Uso de tus Datos Personales',
      useIntro: 'La Compañía puede usar Datos Personales y Contenido del Usuario para los siguientes fines:',
      useItems: {
        provide: 'Para proporcionar y mantener nuestro Servicio: Incluyendo crear los videos, audios y guiones generados por IA que solicitas.',
        manageAccount: 'Para gestionar tu Cuenta: Administrar tu registro como usuario del Servicio.',
        contract: 'Para la ejecución de un contrato: Procesar tu suscripción y asegurar la entrega de los servicios adquiridos.',
        contactYou: 'Para contactarte: Por correo electrónico sobre actualizaciones, alertas de seguridad o comunicaciones relacionadas con funcionalidades.',
        improve: 'Para mejorar y desarrollar nuestro Servicio: Identificar tendencias de uso, determinar la efectividad de campañas promocionales y mejorar nuestros algoritmos y modelos de IA.',
        requests: 'Para gestionar tus solicitudes: Atender y administrar tus solicitudes hacia nosotros.',
        transfers: 'Para transferencias comerciales: Evaluar o llevar a cabo una fusión, desinversión, reestructuración, reorganización, disolución u otra venta o transferencia de activos.'
      },
      thirdPartyTitle: 'Proveedores de Servicios de Terceros',
      thirdPartyIntro: 'Podemos emplear compañías y personas de terceros para facilitar nuestro Servicio ("Proveedores de Servicios"), para proporcionar el Servicio en nuestro nombre o para ayudarnos a analizar cómo se usa nuestro Servicio. Estos terceros tienen acceso a tus Datos Personales solo para realizar estas tareas en nuestro nombre y están obligados a no divulgarlos ni utilizarlos para otro propósito.',
      thirdPartyItems: {
        ai: 'Procesamiento de IA: Usamos modelos de IA confiables de terceros para procesar tu Contenido del Usuario (texto, imagen y audio) y generar la salida final de video.',
        payments: 'Pagos: Usamos procesadores de pago de terceros (como Stripe) para un procesamiento seguro. No almacenamos tus datos completos de tarjeta.',
        analytics: 'Analítica: Podemos usar proveedores de servicios de terceros para monitorear y analizar el uso de nuestro Servicio.'
      },
      retentionTitle: 'Retención de tus Datos Personales',
      retentionIntro: 'La Compañía retendrá tus Datos Personales y Contenido del Usuario solo durante el tiempo necesario para los fines establecidos en esta Política de Privacidad.',
      retentionItems: {
        account: 'Datos de la Cuenta: Retenidos mientras tu cuenta esté activa.',
        content: 'Contenido del Usuario: Retenemos tus recursos cargados y salidas generadas en tu biblioteca para tu conveniencia. Podemos eliminar contenido antiguo de usuarios del Plan Gratuito tras un período prolongado de inactividad.',
        legal: 'Obligaciones Legales: Retendremos y usaremos tus Datos Personales según sea necesario para cumplir obligaciones legales, resolver disputas y hacer cumplir acuerdos.'
      },
      transferTitle: 'Transferencia de tus Datos Personales',
      transferIntro: 'Tu información, incluidos Datos Personales, se procesa en las oficinas operativas de la Compañía y en cualquier otro lugar donde las partes involucradas en el procesamiento estén ubicadas. Esto significa que puede ser transferida y mantenida en computadoras ubicadas fuera de tu jurisdicción donde las leyes de protección de datos pueden diferir.',
      deleteTitle: 'Eliminar tus Datos Personales',
      deleteIntro: 'Tienes derecho a eliminar o solicitar que te ayudemos a eliminar los Datos Personales que hemos recopilado sobre ti. Puedes actualizar, modificar o eliminar tu información (incluyendo videos generados y recursos cargados) en cualquier momento iniciando sesión y gestionando tu biblioteca. Para solicitar la eliminación permanente de tu cuenta y todos los datos asociados, contáctanos en ',
      disclosureTitle: 'Divulgación de tus Datos Personales',
      disclosureItems: {
        business: 'Transacciones Comerciales: Si la Compañía está involucrada en una fusión, adquisición o venta de activos, tus Datos Personales pueden ser transferidos.',
        law: 'Cumplimiento Legal: En ciertas circunstancias, la Compañía puede estar obligada a divulgar tus Datos Personales si lo exige la ley o en respuesta a solicitudes válidas de autoridades públicas.',
        consent: 'Con tu Consentimiento: Podemos divulgar tu información personal para cualquier otro propósito con tu consentimiento.'
      },
      childrenTitle: 'Privacidad de los Menores',
      childrenIntro: 'Nuestro Servicio no está dirigido a menores de 13 años. No recopilamos conscientemente información personal identificable de nadie menor de 13 años.',
      linksTitle: 'Enlaces a Otros Sitios Web',
      linksIntro: 'Nuestro Servicio puede contener enlaces a otros sitios web que no son operados por nosotros. Si haces clic en un enlace de un tercero, serás dirigido a ese sitio. Te recomendamos revisar la Política de Privacidad de cada sitio que visites.',
      rightsTitle: 'Tus Derechos de Protección de Datos (GDPR / UK GDPR)',
      rightsIntro: 'Si eres residente del Reino Unido o del Espacio Económico Europeo (EEE), tienes ciertos derechos de protección de datos, incluyendo acceso, rectificación, eliminación, restricción u objeción al procesamiento. Para ejercer cualquiera de estos derechos, contáctanos en ',
      changesTitle: 'Cambios en esta Política de Privacidad',
      changesIntro: 'Podemos actualizar nuestra Política de Privacidad periódicamente. Te notificaremos cualquier cambio publicando la nueva Política en esta página y actualizando la fecha de "Última actualización".',
      contactTitle: 'Contáctanos',
      contactIntro: 'Si tienes preguntas sobre esta Política de Privacidad, puedes contactarnos:',
      contactEmailPrefix: 'Por correo:'
    },
  },
};

// Add Japanese as a safe fallback by mirroring English content
const translations = {
  ...translationsBase,
  ja: {
    pricing: pricingTranslations.ja,
    partner: partnerTranslations.ja,
    credits: creditsTranslations.ja,
    // Japanese translations for Video Generation page
    videoGeneration: {
      headerTitle: '動画生成',
      headerSubtitle: 'テキスト→動画・画像→動画・高画質化',
      tabs: {
        t2v: 'テキスト→動画',
        i2v: '画像→動画',
        enhance: '高画質化'
      },
      compare: {
        original: '元の動画',
        enhanced: '高画質版'
      },
      form: {
        promptLabel: 'プロンプト',
        promptT2VPlaceholder: '生成したい動画の内容を入力してください',
        promptI2VPlaceholder: '期待するスタイルや内容を入力してください',
        ratioLabel: 'アスペクト比',
        durationLabel: '長さ',
        seconds: '{sec}秒',
        hdMode: 'HDモード',
        clear: 'クリア',
        submit: '生成する',
        submitting: '送信中…',
        generating: '生成中…',
        uploadImageLabel: '画像をアップロード',
        uploadImageDrop: 'クリックまたはドラッグ＆ドロップで画像をアップロード',
        sizeLabel: 'サイズ',
        sizeSmall: '小',
        sizeLarge: '大',
        uploadVideoLabel: '動画をアップロード',
        uploadVideoDrop: 'クリックまたはドラッグ＆ドロップで動画をアップロード',
        resolutionLabel: '解像度',
        enhancing: '高画質化中…',
        enhanceSubmit: '高画質化する'
      },
      alerts: {
        uploadImageFail: '画像のアップロードに失敗しました',
        needImageFile: '画像ファイルを選択してください',
        uploadVideoFail: '動画のアップロードに失敗しました',
        needVideoFile: '動画ファイルを選択してください',
        needVideoFirst: '先に動画をアップロードしてください',
        enhanceFail: '高画質化に失敗しました: {msg}',
        generateFailRetry: '生成に失敗しました。しばらくしてからもう一度お試しください。',
        generateFailWithMsg: '生成に失敗しました: {msg}',
        needPrompt: 'プロンプトを入力してください',
        imageUploadRetry: '画像のアップロードに失敗しました。もう一度お試しください',
        needImageOrUrl: '画像のURLまたはアップロード画像が必要です',
        unexpectedResponse: '想定外の応答形式です',
        generateFail: '生成に失敗しました',
        notFoundStopped: 'タスクが見つからないため停止しました',
        pollingFail: 'ポーリングに失敗しました。後でもう一度お試しください。',
        i2vPollingFail: '画像→動画のポーリングに失敗しました。'
      },
      empty: {
        resultTitle: 'ここに結果が表示されます',
        resultHint: '左のフォームから生成を開始してください'
      }
    },
    helpCenter: {
      badge: 'サポート',
      titleLine1: 'ヘルプセンター',
      titleLine2Gradient: 'FAQ',
      lastUpdatedPrefix: '最終更新:',
      lastUpdatedDate: 'November 26, 2025',
      intro1: 'VGOT ヘルプセンターへようこそ。ここでは料金、クレジット制度、機能の使い方、プランごとの上限などをご案内します。',
      intro2Prefix: 'もし回答が見つからない場合は、こちらまでお問い合わせください:',
      tocTitle: '目次',
      tocItems: {
        item1: 'はじめ方と無料トライアル',
        item2: 'クレジットと消費ルール',
        item3: 'サブスクリプションと上限',
        item4: '主な機能ガイド',
        item5: 'パートナープログラム'
      },
      sections: {
        gettingStarted: {
          title: 'はじめ方と無料トライアル',
          whatIs: {
            title: 'VGOT とは？',
            text: 'テキスト→動画、画像→動画、デジタル解説など、EC向け動画制作のワークフローをAIで一括提供するプラットフォームです。'
          },
          freeTrial: {
            title: '無料トライアル',
            text: '無料プランで主要機能をお試しいただけます。上限に達した場合は有料プランまたは追加クレジットをご検討ください。',
            notePrefix: '注記:',
            noteText: 'プロモーションやイベントにより無料枠は変更されることがあります。'
          }
        },
        credits: {
          title: 'クレジットと消費ルール',
          consumption: {
            title: '消費の仕組み',
            intro: '各機能はクレジットを消費します。消費量は機能と出力サイズによって異なります。',
            items: {
              hypersell: { title: 'HyperSell', text: '商品画像や説明をもとに販促動画を生成します。' },
              superip: { title: 'Super IP（デジタルヒューマン）', points: { p1: '写真からアバターを作成可能', p2: '音声合成に追加クレジットが必要な場合があります' } },
              character: { title: 'キャラクター生成', points: { p1: '多様なスタイルに対応', highlight: 'ヒント:', p2: '一部スタイルは追加クレジットが必要です' } },
              voice: { title: '音声生成', points: { p1: '高品質のTTSに対応', p2Prefix: 'スタジオ品質の', p2Highlight: 'ハイレゾ音声', p2Suffix: 'は追加コストになる場合があります' } },
              hd: { title: 'AI高画質化', text: '低解像度の映像を4K相当に強化します（消費量は尺・解像度に依存）。' }
            }
          },
          expiry: {
            title: 'クレジットの失効',
            monthly: { prefix: '月次', text: '月次プランのクレジットは請求サイクル末で失効します。' },
            yearly: { prefix: '年次', text: '年次プランのクレジットは各年の更新時にリセットされます。' },
            extra: { prefix: '追加パック', text: '追加購入のクレジットはアカウントが有効な限り失効しません。' }
          },
          runOut: { title: '不足時の対応', text: '追加クレジットの購入やプランのアップグレードをご検討ください。' }
        },
        subscription: {
          title: 'サブスクリプションと上限',
          compare: { title: 'プラン比較', textPrefix: '詳細は', linkText: '料金表', textSuffix: 'をご覧ください。' },
          change: {
            title: 'プラン変更',
            intro: 'アカウント設定からいつでもアップグレード/ダウングレードが可能です。',
            items: {
              upgrades: { prefix: 'アップグレード:', text: '上位プランへ変更すると上限が拡張されます。' },
              downgrades: { prefix: 'ダウングレード:', text: '次回の請求期間から適用される場合があります。' }
            }
          }
        },
        features: {
          title: '主な機能ガイド',
          hypersell: {
            title: 'HyperSell',
            whatIs: { title: '概要', text: '商品情報から販促動画を生成する機能です。' },
            points: { costPrefix: '消費', costText: '生成内容に応じてクレジットを消費します。', bestForPrefix: '適用', bestForText: 'EC商品の訴求動画に最適です。' }
          },
          superip: {
            title: 'Super IP',
            whatIs: { title: '概要', text: 'デジタルヒューマンによる長尺動画生成に対応します。' },
            points: { costPrefix: '消費', costText: '尺/解像度に応じてクレジットを消費します。', customizationPrefix: 'カスタム', customizationText: 'ボイスや外見のカスタムが可能です。' }
          },
          scriptMaster: {
            title: 'Script Master',
            how: { title: '使い方' },
            points: {
              freePrefix: '無料', freeText: '商品説明からの台本生成は無料枠があります。',
              paidPrefix: '有料', paidText: '高度な抽出・要約は追加クレジットが必要です。',
              extra: '人気動画URLからの台本抽出にも対応しています。'
            }
          }
        },
        partner: {
          title: 'パートナープログラム',
          how: {
            title: '参加方法',
            intro: '紹介リンクの取得と配布でコミッションを獲得できます。',
            items: {
              commission: { prefix: 'コミッション:', text: '対象売上に継続コミッションが付与されます。' },
              payouts: { prefix: '支払い:', text: 'Stripe Connectで処理されます。' }
            }
          },
          rights: {
            title: '権利と生成物',
            items: {
              free: { prefix: '無料プラン:', text: '生成物は当社が権利を保持します（個人的ライセンス）。' },
              paid: { prefix: '有料プラン:', text: '規約遵守の範囲で生成物の権利は利用者に帰属します。' }
            }
          },
          refund: {
            title: '返金ポリシー',
            items: {
              subscriptions: { prefix: 'サブスク:', text: '将来の請求停止のため、いつでも解約可能です。' },
              credits: { prefix: 'クレジット:', text: '生成に高い計算資源を要するため、使用済みクレジットの返金はできません。' }
            }
          }
        }
      }
    },
    terms: {
      title: '利用規約',
      lastUpdatedPrefix: '最終更新:',
      intro1: '本利用規約（以下「本規約」）は、INFINITE UNIVERSE TECHNOLOGY CO., LTD（以下「VGOT」）が提供するプラットフォーム（以下「本サービス」）の利用条件を定めるものです。',
      intro2: '本サービスへアクセスまたは利用することにより、あなたは本規約に同意したものとみなされます。規約に同意できない場合は、本サービスを利用しないでください。',
      sections: {
        accounts: {
          title: '1. アカウントと登録',
          intro: 'ワークスペース、Super IP、パートナープログラム等の機能へアクセスするにはアカウント登録が必要です。',
          bullets: {
            accuracy: '正確性: 正確で最新の情報を登録してください。',
            security: 'セキュリティ: パスワード管理は利用者の責任です。',
            age: '年齢制限: 13歳未満は利用不可。18歳未満は保護者の同意が必要です。',
            sharing: 'アカウント共有: 席数制限の回避を目的とした共有は禁止で、停止対象となります。'
          }
        },
        subscription: {
          title: '2. サブスクリプション、クレジット、支払い',
          plansTitle: '2.1. サブスクリプションプラン',
          plansIntro: 'VGOTは無料・有料プラン（例: クリエイター、エンタープライズ）を提供します。',
          plansBullets: {
            billing: '請求: 有料プランは月次または年次の定期課金で前払い請求されます。',
            cancellation: '解約: アカウント設定からいつでも解約できます。現在の請求期間終了までは利用可能です。'
          },
          creditsTitle: '2.2. クレジットと利用ポリシー',
          creditsIntro: '本サービスはクレジットベースで動作します（「クレジット＆使用状況」ダッシュボードに表示）。',
          creditsBullets: {
            consumption: '消費: 機能により消費クレジットは異なります（例: script_rewrite, superip_image_gen, video_generation）。必要に応じて消費量は調整される場合があります。',
            expirationMonthly: '月次クレジット: 月次プランに含まれるクレジットは各請求サイクル末で失効し、翌月へ繰り越しされません。',
            expirationExtra: '追加パック: 追加購入の「クレジットパック」はアカウントが有効な限り失効しません。'
          },
          refundTitle: '2.3. 返金ポリシー',
          refundBullets: {
            general: '一般規定: 适用法令を除き、料金（サブスク・クレジットパック）は返金不可です。',
            waiver: 'デジタルコンテンツの撤回権放棄（UK/EU）: 生成を開始した時点で撤回権を明示的に放棄したものとみなされます。',
            unused: '未使用クレジット: 部分的な期間や未使用クレジットの返金は行いません。'
          }
        },
        userContent: {
          title: '3. ユーザーコンテンツとAI生成',
          inputTitle: '3.1. ユーザー入力',
          inputIntro: 'アップロードするテキスト、画像、音声、動画（「ユーザー入力」）の権利を保持します。適法かつ利用権を有することを保証してください。',
          featureTitle: '3.2. 機能別ポリシー',
          hypersellBullets: {
            commercial: '商用利用: HyperSellへアップロードする商品・ブランド・画像の権利を有し、広告法に準拠すること。',
            counterfeits: '模倣品禁止: 違法・虚偽・誤解を招く商品の宣伝は禁止。'
          },
          superipBullets: {
            consent: '厳格な同意: 第三者の写真・音声は書面による明確な同意なくアップロードしないこと。',
            biometric: '生体情報: 政治家、著名人、同意のない個人のなりすましは禁止。'
          },
          ownershipTitle: '3.3. 生成物の権利',
          ownershipBullets: {
            free: '無料プラン: VGOTが権利を保持。個人的な限定ライセンスを付与。作品を事例として紹介する場合があります。',
            paid: '有料プラン: 規約遵守の範囲で、生成物の権利は利用者に帰属します。'
          }
        },
        partner: {
          title: '4. パートナープログラム',
          intro: 'VGOT パートナープログラムに参加する場合:',
          bullets: {
            commission: 'コミッション: 紹介リンク経由の対象売上に対し、継続コミッションを獲得できます。',
            payouts: '支払い: Stripe Connectを通じて処理。正確な税務・銀行情報を提供してください。',
            prohibited: '禁止行為: 自己紹介、ブランドキーワード入札、スパム、誤解を招く広告はBANおよび没収対象。'
          }
        },
        acceptable: {
          title: '5. 許容利用と禁止コンテンツ',
          intro: '以下の目的で本サービスを利用しないことに同意します:',
          prohibitedList: {
            illegal: '違法コンテンツ: 法令違反（例: 児童搾取、違法行為）。',
            sexual: '性的に露骨: ヌード、ポルノ、性的に露骨な内容。',
            hate: '憎悪表現・嫌がらせ: 暴力、差別、憎悪、ハラスメントの助長。',
            deepfakes: 'ディープフェイク・偽情報: 誤解を招く情報拡散、同意のないなりすまし。',
            selfHarm: '自傷行為: 自傷、自殺、摂食障害の助長。',
            ip: '知的財産侵害: 著作権、商標、プライバシー権の侵害。'
          },
          platformTitle: 'プラットフォーム制限:',
          platformBullets: {
            scripts: '自動スクリプト/ボットによるスクレイピング禁止。',
            reverse: '逆コンパイルやモデル抽出の試行禁止。',
            compete: '本サービスを用いた競合製品の構築は禁止。'
          }
        },
        analysis: {
          title: '6. 動画分析と第三者リンク',
          intro: '「スクリプト」および「動画分析」機能では、第三者プラットフォームのURL入力が可能です。',
          bullets: {
            affiliation: '非提携: TikTok、Instagram、YouTubeと提携関係はありません。',
            responsibility: '責任: 分析したデータの利用が原作者の権利を侵害しないようにしてください。'
          }
        },
        disclaimer: {
          title: '7. 免責事項',
          intro: '本サービスは「現状有姿」「提供可能な範囲」で提供されます。AIは誤った/不快な内容を生成する場合があります。中断やエラーなき提供を保証しません。'
        },
        liability: {
          title: '8. 責任の限定',
          intro: '間接的、付随的、特別、結果的、懲罰的損害（利益、データ、信用の損失等）について、当社は責任を負いません。'
        },
        indemnification: {
          title: '9. 免責・補償',
          intro: '利用、規約違反、コンテンツに起因する請求からVGOTおよび関連当事者を防御・免責することに同意します。'
        },
        termination: {
          title: '10. 契約終了',
          intro: '違反がある場合、当社は直ちにアカウントを停止・終了することがあります。終了後、権利は消滅します。'
        },
        law: {
          title: '11. 準拠法',
          intro: '本規約は英国法に準拠し、紛争は英国の裁判所に提起されます。'
        },
        contact: {
          title: '12. お問い合わせ',
          intro: '本規約に関するお問い合わせは以下までお願いします。',
          emailPrefix: 'メール:'
        }
      }
    },
    nav: {
      home: 'ホーム',
      features: '機能',
      solutions: 'ソリューション',
      pricing: '料金',
      partner: 'パートナープログラム',
      helpCenter: 'ヘルプセンター',
      help: 'ヘルプ',
      login: 'ログイン',
      startFree: '無料トライアルを開始',
    },
    hero: {
      badge: 'AI搭載の動画制作プラットフォーム',
      headline1: 'ワンストップのAI EC動画ワークフロー',
      headline2: '数秒でバズるEC動画を作成',
      subheading: '台本コピーからHyperSell動画生成、デジタル解説まで——EC動画制作の全工程をVGOTがカバー。',
      sellingPoint1: '無料の台本作成・抽出',
      sellingPoint2: 'ワンクリックのスマートプロンプト複製',
      sellingPoint3: '最長10分・超高速の動画生成',
      sellingPoint4: 'AIによる4K品質強化',
      ctaPrimary: '無料で作成を始める',
      ctaSecondary: '料金を見る',
      stats: '10,000人以上のクリエイターに選ばれています',
      videosGenerated: '累計 200万本以上の動画を生成',
      activateEngine: 'バイラルエンジンを起動',
      waiting: '入力待ち…',
      distribute: '主要プラットフォームへ直接配信',
      viewsLabel: '視聴',
      salesLabel: '売上',
    },
    trustLogos: { title: '主要プラットフォームに信頼されています' },
    features: {
      title: '複雑さにサヨナラ—EC動画制作をAIで刷新',
      subtitle: '台本の企画から公開まで、必要なものはすべてここに。',
      scriptGenerator: {
        title: 'Script Master',
        description: '商品説明からの自動生成や、流行動画からの台本抽出で、ネタ出しの壁を突破。',
      },
      soraVideo: {
        title: 'Smart Prompt',
        description: '動画の背後にあるキープロンプトを解析・抽出し、試行錯誤なしで成功を再現。',
      },
      digitalExpert: {
        title: 'Long-Form Video Maker',
        description: '短尺の制限を超えて、最長10分のデジタルヒューマン動画を生成。深い内容も余裕で対応。',
      },
      videoTools: {
        title: 'AI Quality Enhance',
        description: '独自AIで低解像度の映像を一瞬でシネマ級4Kに。作品の完成度が一段上に。',
      },
    },
    painPoints: {
      title: 'こんな悩み、ありませんか？',
      slowScript: { title: '台本作成に時間がかかる', description: '毎回の台本に何時間も？AI台本生成で即スタート。' },
      complexTools: { title: 'ツールが複雑', description: '編集・字幕・効果で複数ツールを行き来？VGOTなら一つのワークフローで完結。' },
      poorQuality: { title: '品質が安定しない', description: '低解像度や素人感が気になる？VGOTなら毎回プロ品質に。' },
      timeConsuming: { title: '編集が重労働', description: 'ポスプロに数日？自動化で編集時間を最大90%短縮。' },
    },
    useCases: {
      title: 'あらゆるECシーンに最適',
      productDemo: { title: '商品デモ', description: 'AIナレーションで購入意欲を高める訴求動画。' },
      unboxing: { title: '開封動画', description: 'ワクワク感を演出するプロ品質のアンボックス。' },
      tutorial: { title: 'ハウツー', description: '手順が分かるチュートリアルで顧客をサポート。' },
      testimonial: { title: 'お客様の声', description: 'レビューを魅力的な映像ストーリーに。' },
      comparison: { title: '比較動画', description: '並べて比較し、購入判断を後押し。' },
      socialMedia: { title: 'SNS広告', description: 'TikTok/Instagram/YouTube向け動画を数秒で。' },
    },
    howItWorks: {
      title: 'たった3ステップでバズ動画',
      step1: { title: '入力・抽出', description: '商品URLを貼る／参考動画をアップロード／AIで台本を抽出。' },
      step2: { title: 'カスタマイズ＆生成', description: 'スタイル・音声・尺を選択。数分でHyperSellが映像を作成。' },
      step3: { title: '強化＆公開', description: 'フィルター・字幕・翻訳を適用し、各プラットフォームへ配信。' },
    },
    valueProposition: {
      title1: '高コスト・低効率にサヨナラ',
      title2: '投資を成果に直結',
      description: 'これまで数日・数万円かかった作業を数クリックに。商品動画・台本・デジタル解説を1つのプラットフォームで。すでに1万人以上のクリエイターが活用中。',
      cta: '今すぐ無料で試す',
    },
    pricingTeaser: {
      title: '誰でも始めやすい透明な料金',
      description: '無料で始め、成長に合わせて拡張。追加費用なし。',
      ctaPrimary: '料金の詳細を見る',
      freeTag: 'ずっと無料',
      proTag: '一番人気',
      enterpriseTag: 'カスタム対応',
    },
    partnerProgram: {
      title: 'パートナープログラムに参加',
      description: 'オーディエンスにVGOTを紹介して継続コミッションを獲得。',
      commission: '最大30%のコミッション',
      support: '専任パートナーサポート',
      resources: 'マーケ素材を提供',
      ctaPrimary: 'パートナーになる',
    },
    footer: {
      description: 'AIでEC動画制作を加速。',
      product: '製品',
      features: '機能',
      pricing: '料金',
      useCases: 'ユースケース',
      company: '会社',
      about: '私たちについて',
      blog: 'ブログ',
      careers: '採用',
      support: 'サポート',
      help: 'ヘルプセンター',
      docs: 'ドキュメント',
      contact: 'お問い合わせ',
      legal: '法務',
      privacy: 'プライバシーポリシー',
      terms: '利用規約',
      cookies: 'クッキーポリシー',
      copyright: '© 2025 VGOT. 無断転載を禁じます。',
    },
    contact: {
      badge: 'お問い合わせ',
      titleLine1: 'まずは',
      titleLine2Gradient: 'ご相談ください。',
      subtitle: 'エンタープライズのご相談、カスタムデモの依頼など、お気軽にお問い合わせください。',
      generalSupportLabel: '一般サポート',
      partnerProgramLabel: 'パートナープログラム'
    },
    privacy: {
      title: 'プライバシーポリシー',
      intro1: '本プライバシーポリシーは、本サービス利用時における情報の収集・利用・開示に関する方針を説明し、あなたのプライバシー権についてご案内します。',
      intro2: '本サービスの提供および改善のために個人データを利用します。本サービスを利用することで、本ポリシーに従った情報の取扱いに同意したものとみなされます。',
      lastUpdatedPrefix: '最終更新:',
      interpretationTitle: '解釈と定義',
      interpretation: '解釈',
      interpretationText: '大文字で始まる語は以下の条件の下で定義されます。単数・複数に関わらず同一の意味を持ちます。',
      definitions: '定義',
      definitionsIntro: '本ポリシーにおける定義:',
      definitionsList: {
        account: '「アカウント」とは、本サービスまたはその一部へアクセスするために作成された一意のアカウントを指します。',
        company: '「会社」とは、本規約における「当社」「当社ら」「弊社」を意味し、INFINITE UNIVERSE TECHNOLOGY CO., LTDを指します。',
        cookies: '「クッキー」とは、ウェブサイトによりあなたの端末に保存される小さなファイルで、閲覧履歴などを記録します。',
        country: '「国」とは、英国を指します。',
        device: '「デバイス」とは、コンピュータ、携帯電話、タブレットなど本サービスへアクセス可能な機器を指します。',
        personalData: '「個人データ」とは、識別されたまたは識別可能な個人に関する情報を指します。',
        service: '「サービス」とは、本ウェブサイトを指します。',
        serviceProvider: '「サービス提供者」とは、当社に代わってデータ処理を行う自然人または法人を指します。',
        usageData: '「利用データ」とは、本サービスの利用から自動収集されるデータを指します。',
        website: '「ウェブサイト」とは、VGOT（https://www.vgot.ai）を指します。',
        you: '「あなた」とは、本サービスへアクセスまたは利用する個人、またはその代理として本サービスを利用する法人等を指します。'
      },
      collectingTitle: 'データの収集について',
      typesCollectedTitle: '収集するデータの種類',
      personalDataTitle: '個人データ',
      personalDataIntro: '当社は、サービス提供・改善のために一定の個人データを収集する場合があります。',
      personalDataItems: {
        email: 'メールアドレス',
        credentials: 'アカウント認証情報（安全に暗号化）',
        payment: '決済・請求情報（第三者決済処理で安全に処理）',
        usageData: '利用データ'
      },
      collectionTitle: '収集する情報',
      collectionItems: {
        email: 'メールアドレス',
        account: 'アカウント認証情報（安全に暗号化）',
        payment: '決済・請求情報（第三者決済処理を通じて安全に処理）',
        usage: '利用データ',
      },
      userContentTitle: 'ユーザーコンテンツ',
      userContentIntro: '生成サービス提供のため、あなたがアップロード・入力・提供するコンテンツを処理します。例: 画像・写真・動画・音声、テキスト入力、分析用URLなど。',
      userContentItems: {
        media: 'メディア資産（画像・写真・動画・音声など）',
        text: 'テキスト入力（プロンプト、スクリプト、説明文など）',
        biometric: '生体データ（顔画像・音声などが含まれる場合の処理）'
      },
      usageDataTitle: '利用データ',
      usageDataIntro: 'IPアドレス、ブラウザ情報、訪問ページ、滞在時間、ユニーク識別子等を診断目的で収集する場合があります。',
      trackingTitle: 'トラッキング技術とクッキー',
      trackingIntro: '当社はクッキーや類似のトラッキング技術を用いて本サービス上の活動を追跡し、一定の情報を保存します。',
      trackingItems: {
        necessary: '必須クッキー: 認証とセキュリティに必要。',
        functionality: '機能クッキー: 設定や好みを記憶。',
        analytics: '分析・アフィリエイトクッキー: サイトのパフォーマンス測定や紹介の帰属。'
      },
      useTitle: '個人データの利用目的',
      useIntro: '当社は以下の目的であなたの個人データを利用する場合があります。',
      useItems: {
        provide: 'サービスの提供・維持',
        manageAccount: 'アカウントの管理',
        contract: '契約の履行',
        contactYou: '連絡（通知・更新・セキュリティ等）',
        improve: 'サービスの改善・機能開発',
        requests: '利用者からの要請への対応',
        transfers: '必要に応じた国際的なデータ移転'
      },
      thirdPartyTitle: '第三者サービス',
      thirdPartyIntro: '以下の第三者サービスと連携する場合があります。',
      thirdPartyItems: {
        ai: 'AI生成・分析サービス',
        payments: '決済処理（Stripe等）',
        analytics: 'アクセス解析・パフォーマンス測定'
      },
      retentionTitle: '保持期間',
      retentionIntro: 'アカウントが有効な間は必要な範囲で個人データとユーザーコンテンツを保持します。無料プランの古いコンテンツは長期非アクティブ後に削除される場合があります。',
      retentionItems: {
        account: 'アカウントデータ: アカウントが有効な間保持します。',
        content: 'ユーザーコンテンツ: ライブラリ利便性のため保持。無料プランの古いコンテンツは長期非アクティブ後に削除される場合があります。',
        legal: '法的義務: 法令遵守、紛争解決、契約履行のため必要に応じて保持します。'
      },
      transferTitle: '個人データの移転',
      transferIntro: 'データは各拠点で処理され、法域をまたいで転送・保管されることがあります。',
      deleteTitle: '個人データの削除',
      deleteIntro: '収集済みの個人データの削除を要求できます。ライブラリからいつでも更新・削除できます。恒久的なアカウント削除はサポートまでご連絡ください。',
      disclosureTitle: '個人データの開示',
      disclosureItems: {
        business: '事業譲渡・合併等: 取引に伴い個人データが移転される場合があります。',
        law: '法令遵守: 法令または公的機関の要請に基づき開示される場合があります。',
        consent: '同意に基づく開示: 同意のあるその他の目的で開示することがあります。',
      },
      childrenTitle: '児童のプライバシー',
      childrenIntro: '本サービスは13歳未満を対象としていません。13歳未満の個人情報は意図的に収集しません。',
      linksTitle: '外部サイトへのリンク',
      linksIntro: '第三者サイトへのリンクを含む場合があります。各サイトのプライバシーポリシーをご確認ください。',
      rightsTitle: 'データ保護の権利（GDPR / UK GDPR）',
      rightsIntro: '英国またはEEA居住者は、アクセス、訂正、削除、処理の制限・異議などの権利を有します。行使するにはサポートへご連絡ください。',
      changesTitle: '本ポリシーの変更',
      changesIntro: '本ポリシーは随時更新されることがあります。ページの掲載と「最終更新」日の更新により通知します。',
      contactTitle: 'お問い合わせ',
      contactIntro: '本プライバシーポリシーに関するお問い合わせはこちら:',
      contactEmailPrefix: 'メール:'
    },
  },
};

export { translations };
