import { FeatureLdg, InfoLdg, TestimonialType } from "@/types";

export const infos: InfoLdg[] = [
    {
        title: "Revolutionize Warehouse Safety",
        description:
        "Harness real-time analytics, 3D visualization, and predictive insights to create a safer, more efficient work environment.",
        image: "/_static/illustrations/warehouse.png",
        list: [
            {
                title: "Real-Time Monitoring",
                description:
                "Get instant alerts and actionable insights from our advanced sensor network.",
                icon: 'Eye',
            },
            {
                title: "AI-Driven Analytics",
                description:
                    "Leverage machine learning for predictive risk assessment and proactive safety measures.",
                icon: 'Cpu',
            },
            {
                title: "3D Warehouse Mapping",
                description:
                    "Navigate your facility virtually and access item details with a single tap.",
                icon: 'TrendingUp',
            },
            {
                title: "IoT Integration",
                description:
                "Seamlessly connect and manage all your warehouse IoT devices from a central hub.",
                icon: 'Zap',
            },
        ]
    },
    {
        title: "Seamless Safety Integration",
        description:
          "Integrate our AI-powered warehouse safety platform effortlessly into your existing operations. Connect with your current systems and IoT devices for a comprehensive safety solution that enhances your workflow.",
        image: "/_static/illustrations/warehouse-integration.jpg",
        list: [
          {
            title: "IoT Compatibility",
            description:
              "Easily connect with a wide range of sensors and IoT devices for real-time monitoring.",
            icon: 'Puzzle',
          },
          {
            title: "Rapid Deployment",
            description:
              "Get up and running quickly with our streamlined setup process and expert support.",
            icon: 'Zap',
          },
          {
            title: "Data Security",
            description:
              "Ensure your sensitive data is protected with our robust encryption and compliance measures.",
            icon: 'Shield',
          },
          {
            title: "API Flexibility",
            description:
              "Customize integrations with our comprehensive API to fit your unique warehouse needs.",
            icon: 'Layers',
          },
          {
            title: "Workflow Automation",
            description:
              "Automate safety protocols and alerts to streamline your processes and reduce manual effort.",
            icon: 'Workflow',
          },
          {
            title: "Comprehensive Documentation",
            description:
              "Access detailed guides and API documentation for smooth implementation and maintenance.",
            icon: 'BookOpen',
          },
        ],
      }
];


export const features: FeatureLdg[] = [
    {
      title: "Real-Time Safety Analytics",
      description:
        "Monitor warehouse conditions in real-time with advanced sensors, providing instant alerts and actionable insights to prevent accidents and optimize safety protocols.",
      link: "/analytics",
      icon: "Cpu",
    },
    {
      title: "3D Item Mapping",
      description:
        "Navigate your warehouse virtually with our interactive 3D IFC model. Tap on items to view detailed information, improving inventory management and spatial awareness.",
      link: "/3d-mapping",
      icon: 'Box',
    },
    {
      title: "AI-Powered Safety Assistant",
      description:
        "Interact with our intelligent chatbot or voice assistant for instant safety recommendations, equipment locations, and procedural guidance, enhancing operational efficiency.",
      link: "/ai-assistant",
      icon: 'BotIcon',
    },
    {
      title: "IoT Integration Hub",
      description:
        "Seamlessly connect and manage all your warehouse IoT devices from a central dashboard, ensuring comprehensive safety coverage and data synchronization.",
      link: "/iot-hub",
      icon: 'Cpu',
    },
    {
      title: "Predictive Risk Assessment",
      description:
        "Leverage advanced machine learning algorithms to predict potential safety hazards before they occur, allowing proactive measures to maintain a secure work environment.",
      link: "/risk-assessment",
      icon: 'Shield',
    },
    {
      title: "Multilingual Safety Insights",
      description:
        "Break language barriers with NLP-powered translations of sensor data and safety instructions, ensuring clear communication across your diverse workforce.",
      link: "/multilingual",
      icon: 'Megaphone',
    },
  ]

export const testimonials: TestimonialType[] = [
    {
        name: "John Doe",
        job: "Full Stack Developer",
        image: "https://randomuser.me/api/portraits/men/1.jpg",
        review: "The real-time analytics have revolutionized our safety protocols. We've seen a 40% reduction in workplace incidents since implementing this solution.",
    },
    {
        name: "Alice Smith",
        job: "UI/UX Designer",
        image: "https://randomuser.me/api/portraits/women/2.jpg",
        review: "The 3D item mapping feature has dramatically improved our inventory management. We can locate items faster and optimize space utilization like never before.",
    },
    {
        name: "David Johnson",
        job: "DevOps Engineer",
        image: "https://randomuser.me/api/portraits/men/3.jpg",
        review: "The AI-powered safety assistant has become an indispensable tool for our team. It's like having a safety expert on call 24/7.",
    },
    {
        name: "Michael Wilson",
        job: "Project Manager",
        image: "https://randomuser.me/api/portraits/men/5.jpg",
        review: "Integrating our existing IoT devices was seamless. The centralized dashboard gives us unprecedented visibility into our warehouse operations.",
    },
    {
        name: "Sophia Garcia",
        job: "Data Analyst",
        image: "https://randomuser.me/api/portraits/women/6.jpg",
        review: "The predictive risk assessment feature has transformed how we approach warehouse insurance. It's proactive, data-driven, and incredibly accurate.",
    },
    {
        name: "Emily Brown",
        job: "Marketing Manager",
        image: "https://randomuser.me/api/portraits/women/4.jpg",
        review: "The multilingual capabilities have been a game-changer for our diverse workforce. Safety instructions are now clearly understood by all, regardless of language barriers.",
    },
    {
        name: "Jason Stan",
        job: "Web Designer",
        image: "https://randomuser.me/api/portraits/men/9.jpg",
        review: "Implementing this system has not only enhanced our safety standards but also significantly improved our operational efficiency. It's been a worthwhile investment with tangible ROI.",
    },
];
