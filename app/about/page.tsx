import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { MailIcon, UserIcon } from "lucide-react"

export default function About() {
  const teamMembers = [
    {
      name: "Tariku Negash",
      id: "UGR/22808/13",
      role: "Project Manager & Database Specialist",
      department: "CSE",
      description:
        "Leading the project coordination and designing efficient database schemas for secure file management.",
      email: "tariku.n@astu.edu.et",
    },
    {
      name: "Fasika Zergaw",
      id: "UGR/23653/13",
      role: "Backend Developer & API Integration",
      department: "CSE",
      description: "Building robust APIs and integrating blockchain with traditional databases and IPFS storage.",
      email: "fasika.z@astu.edu.et",
    },
    {
      name: "Gemechis Biru",
      id: "UGR/22621/13",
      role: "Frontend Developer & UI/UX",
      department: "CSE",
      description: "Creating responsive user interfaces and ensuring optimal user experience across all devices.",
      email: "gemechis.b@astu.edu.et",
    },
    {
      name: "Ebisa Ajema",
      id: "UGR/23718/13",
      role: "Software Architecture & Testing",
      department: "SE",
      description: "Designing system architecture and implementing comprehensive testing strategies for reliability.",
      email: "ebisa.a@astu.edu.et",
    },
    {
      name: "Eden Tatek",
      id: "UGR/22931/13",
      role: "Infrastructure Engineer & Security",
      department: "EPCE",
      description: "Managing cloud infrastructure, deployment strategies, and implementing security protocols.",
      email: "eden.t@astu.edu.et",
    },
    {
      name: "Gothoneyal Mekonnen",
      id: "UGR/22660/13",
      role: "Blockchain Developer & Smart Contracts",
      department: "CSE",
      description: "Developing smart contracts for access control and implementing blockchain integration.",
      email: "gothoneyal.m@astu.edu.et",
    },
    {
      name: "Biruk Mekete",
      id: "UGR/23100/13",
      role: "Network Optimization & Performance",
      department: "EPCE",
      description: "Optimizing network performance, IPFS integration, and ensuring system scalability.",
      email: "biruk.m@astu.edu.et",
    },
    {
      name: "Amanuel Dereje",
      id: "UGR/22797/13",
      role: "Security Specialist & Encryption",
      department: "CSE",
      description: "Implementing AES-256 encryption protocols and ensuring data security best practices.",
      email: "amanuel.d@astu.edu.et",
    },
    {
      name: "Natnael Ayele",
      id: "UGR/23704/13",
      role: "Quality Assurance & Documentation",
      department: "SE",
      description: "Ensuring code quality, system documentation, and maintaining development standards.",
      email: "natnael.a@astu.edu.et",
    },
    {
      name: "Natnael Fekadu",
      id: "UGR/22640/13",
      role: "Analytics Developer & Monitoring",
      department: "CSE",
      description: "Implementing analytics systems, monitoring tools, and performance tracking for the platform.",
      email: "natnael.f@astu.edu.et",
    },
  ]

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case "SE":
        return "bg-emerald-900/30 text-emerald-400 border-emerald-800"
      case "EPCE":
        return "bg-blue-900/30 text-blue-400 border-blue-800"
      case "CSE":
        return "bg-purple-900/30 text-purple-400 border-purple-800"
      default:
        return "bg-gray-900/30 text-gray-400 border-gray-800"
    }
  }

  const getDepartmentFullName = (department: string) => {
    switch (department) {
      case "SE":
        return "Software Engineering"
      case "EPCE":
        return "Electrical Power and Control Engineering"
      case "CSE":
        return "Computer Science and Engineering"
      default:
        return department
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-16 text-center">
        <h1 className="text-5xl font-bold mb-6">About SecureShare</h1>
        <p className="text-xl mb-8 max-w-3xl mx-auto text-gray-300">
          A collaborative final-year project by 10 dedicated students from Adama Science and Technology University,
          developing the future of secure file sharing using blockchain technology.
        </p>
      </section>

      {/* Project Overview */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-gray-300 mb-6">
              SecureShare represents the culmination of interdisciplinary collaboration between Software Engineering
              (SE), Electrical Power and Control Engineering (EPCE), and Computer Science and Engineering (CSE)
              departments.
            </p>
            <p className="text-gray-300 mb-6">
              Our goal is to revolutionize file sharing by leveraging blockchain technology, decentralized storage
              (IPFS), and advanced encryption to create a platform that prioritizes security, transparency, and user
              control.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-emerald-900/30 px-4 py-2 rounded-lg border border-emerald-800">
                <span className="text-emerald-400 font-semibold">AES-256 Encryption</span>
              </div>
              <div className="bg-blue-900/30 px-4 py-2 rounded-lg border border-blue-800">
                <span className="text-blue-400 font-semibold">IPFS Storage</span>
              </div>
              <div className="bg-purple-900/30 px-4 py-2 rounded-lg border border-purple-800">
                <span className="text-purple-400 font-semibold">Ethereum Blockchain</span>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
            <h3 className="text-2xl font-bold mb-4">Project Timeline</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-emerald-500 rounded-full mr-4"></div>
                <div>
                  <p className="font-semibold">June 1, 2025</p>
                  <p className="text-sm text-gray-400">Development Started</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full mr-4"></div>
                <div>
                  <p className="font-semibold">June 10, 2025</p>
                  <p className="text-sm text-gray-400">Beta Testing Phase</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-purple-500 rounded-full mr-4"></div>
                <div>
                  <p className="font-semibold">June 15, 2025</p>
                  <p className="text-sm text-gray-400">Final Submission</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-12 text-center">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700 text-white hover:bg-gray-750 transition-colors">
              <CardHeader>
                <div className="flex items-center mb-2">
                  <UserIcon className="h-8 w-8 text-emerald-500 mr-3" />
                  <div>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <p className="text-sm text-gray-400">{member.id}</p>
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-300 mb-2">{member.role}</p>
                <div
                  className={`inline-block px-3 py-1 rounded-full text-xs border ${getDepartmentColor(member.department)}`}
                >
                  {getDepartmentFullName(member.department)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm mb-4">{member.description}</p>
                <div className="flex items-center text-sm text-gray-400">
                  <MailIcon className="h-4 w-4 mr-2" />
                  <span>{member.email}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Department Statistics */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-12 text-center">Team Composition</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-purple-900 rounded-lg p-6 mb-4">
              <h3 className="text-3xl font-bold mb-2">6</h3>
              <p className="text-sm text-gray-300">Computer Science & Engineering</p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-emerald-900 rounded-lg p-6 mb-4">
              <h3 className="text-3xl font-bold mb-2">2</h3>
              <p className="text-sm text-gray-300">Software Engineering</p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-blue-900 rounded-lg p-6 mb-4">
              <h3 className="text-3xl font-bold mb-2">2</h3>
              <p className="text-sm text-gray-300">Electrical Power & Control Engineering</p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="container mx-auto px-4 py-16 bg-gray-900 rounded-lg my-16">
        <h2 className="text-3xl font-bold mb-12 text-center">Technology Stack</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-emerald-900 rounded-lg p-6 mb-4">
              <h3 className="text-xl font-semibold mb-2">Frontend</h3>
              <p className="text-sm text-gray-300">React, Next.js, Tailwind CSS</p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-blue-900 rounded-lg p-6 mb-4">
              <h3 className="text-xl font-semibold mb-2">Backend</h3>
              <p className="text-sm text-gray-300">Node.js, Express.js, MongoDB</p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-purple-900 rounded-lg p-6 mb-4">
              <h3 className="text-xl font-semibold mb-2">Blockchain</h3>
              <p className="text-sm text-gray-300">Ethereum, Solidity, Web3.js</p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-amber-900 rounded-lg p-6 mb-4">
              <h3 className="text-xl font-semibold mb-2">Storage</h3>
              <p className="text-sm text-gray-300">IPFS, Decentralized Storage</p>
            </div>
          </div>
        </div>
      </section>

      {/* University Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-6">Adama Science and Technology University</h2>
        <p className="text-xl mb-8 max-w-3xl mx-auto text-gray-300">
          This project represents the collaborative spirit and technical excellence fostered at ASTU, bringing together
          students from multiple engineering disciplines to solve real-world challenges in secure file sharing.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700">
            <Link href="/register">Join SecureShare</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-emerald-600 text-emerald-500 hover:bg-emerald-950"
          >
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
