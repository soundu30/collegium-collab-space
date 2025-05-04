
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { BookOpen, FileText, Calendar, MessageSquare, Users } from 'lucide-react';

const Index: React.FC = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-12 md:py-20 text-center">
        <div className="container px-4 mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-collegium-primary">
            Connect, Collaborate, and Succeed
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-10 text-gray-600">
            Collegium is the ultimate platform for college students to connect, share resources, 
            discuss ideas, and collaborate with peers from your campus.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="text-base">
                Join Collegium
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="text-base">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-50">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Everything You Need to Succeed</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Discussion Forums */}
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-collegium-light p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <BookOpen className="text-collegium-primary h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-2">Discussion Forums</h3>
              <p className="text-gray-600">
                Create and join discussions about courses, campus life, academic topics, and more. 
                Share your insights and learn from your peers.
              </p>
            </div>
            
            {/* Resource Sharing */}
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-collegium-light p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <FileText className="text-collegium-primary h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-2">Resource Sharing</h3>
              <p className="text-gray-600">
                Upload and download study materials, notes, practice exams, and other academic resources
                to enhance your learning experience.
              </p>
            </div>
            
            {/* Event Calendar */}
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-collegium-light p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Calendar className="text-collegium-primary h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-2">Event Calendar</h3>
              <p className="text-gray-600">
                Stay updated with campus events, club meetings, study sessions, and academic deadlines
                all in one place.
              </p>
            </div>
            
            {/* Messaging System */}
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-collegium-light p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <MessageSquare className="text-collegium-primary h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-2">Messaging System</h3>
              <p className="text-gray-600">
                Connect privately with classmates, study partners, and project team members
                through our secure messaging system.
              </p>
            </div>
            
            {/* Collaborative Network */}
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-collegium-light p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Users className="text-collegium-primary h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-2">Collaborative Network</h3>
              <p className="text-gray-600">
                Build your academic network by connecting with students from your classes, 
                major, and those with similar academic interests.
              </p>
            </div>
            
            {/* Academic Success */}
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-collegium-light p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <BookOpen className="text-collegium-primary h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-2">Academic Success</h3>
              <p className="text-gray-600">
                Improve your academic performance by leveraging the collective knowledge
                and resources of the Collegium community.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-collegium-primary text-white">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Enhance Your College Experience?</h2>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Join thousands of students already using Collegium to connect, collaborate, and succeed.
          </p>
          <Link to="/register">
            <Button size="lg" variant="secondary" className="text-base">
              Create Your Account
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
