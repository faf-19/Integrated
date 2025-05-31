import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { FileIcon, LockIcon, ShieldIcon, UsersIcon } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-16 text-center">
        <h1 className="text-5xl font-bold mb-6">SecureShare</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-300">
          Secure file sharing powered by blockchain technology, decentralized storage, and advanced encryption
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700">
            <Link href="/register">Get Started</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-emerald-600 text-emerald-500 hover:bg-emerald-950"
          >
            <Link href="/about">Learn More</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-12 text-center">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <LockIcon className="h-12 w-12 text-emerald-500 mb-2" />
              <CardTitle>End-to-End Encryption</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                AES-256 encryption ensures your files remain private and secure at all times.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <FileIcon className="h-12 w-12 text-emerald-500 mb-2" />
              <CardTitle>Decentralized Storage</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Files are stored on IPFS, ensuring no single point of failure and enhanced security.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <ShieldIcon className="h-12 w-12 text-emerald-500 mb-2" />
              <CardTitle>Blockchain Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Every file transaction is recorded on the blockchain, providing immutable audit trails.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <UsersIcon className="h-12 w-12 text-emerald-500 mb-2" />
              <CardTitle>Smart Access Control</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Dynamic permission management through smart contracts for granular access control.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-16 bg-gray-900 rounded-lg my-16">
        <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-emerald-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Upload & Encrypt</h3>
            <p className="text-gray-300">
              Upload your files and they're automatically encrypted using AES-256 encryption.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-emerald-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Store & Verify</h3>
            <p className="text-gray-300">Files are stored on IPFS and verified on the Ethereum blockchain.</p>
          </div>

          <div className="text-center">
            <div className="bg-emerald-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Share & Control</h3>
            <p className="text-gray-300">
              Share files with others and maintain granular control over access permissions.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to secure your files?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-300">
          Join SecureShare today and experience the future of secure file sharing.
        </p>
        <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700">
          <Link href="/register">Sign Up Now</Link>
        </Button>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>© 2025 SecureShare - Adama Science and Technology University</p>
          <p className="mt-2">Developed by ASTU Software Engineering, EPCE, and CSE Departments</p>
        </div>
      </footer>
    </div>
  )
}
