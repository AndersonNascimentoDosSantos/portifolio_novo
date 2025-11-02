/* eslint-disable @typescript-eslint/no-explicit-any */
// components/Portfolio.js - Client Component
"use client";

import { useState } from "react";
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Menu,
  X,
  Loader2,
} from "lucide-react";

export default function Portfolio({ initialData }: { initialData: any }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [contactStatus, setContactStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const { profile, social_links, projects, skills } = initialData || {};

  const handleContactChange = (e: any) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleContactSubmit = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);
    setContactStatus({ type: "", message: "" });

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost/api";
      const response = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactForm),
      });

      const result = await response.json();

      if (response.ok) {
        setContactStatus({
          type: "success",
          message: result.message || "Mensagem enviada com sucesso!",
        });
        setContactForm({ name: "", email: "", subject: "", message: "" });
      } else {
        const errorMessage = result.errors
          ? Object.values(result.errors).flat().join(", ")
          : "Erro ao enviar mensagem";
        setContactStatus({ type: "error", message: errorMessage });
      }
    } catch (error) {
      setContactStatus({
        type: "error",
        message: "Erro ao enviar mensagem. Tente novamente.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const scrollToSection = (id: any) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false);
    }
  };

  const getSocialIcon = (platform: any) => {
    switch (platform.toLowerCase()) {
      case "github":
        return <Github size={20} />;
      case "linkedin":
        return <Linkedin size={20} />;
      case "email":
        return <Mail size={20} />;
      default:
        return <Mail size={20} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white shadow-sm z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-xl font-bold text-gray-800">
              {profile?.name || "Portfolio"}
            </div>

            <div className="hidden md:flex space-x-8">
              <button
                onClick={() => scrollToSection("sobre")}
                className="text-gray-600 hover:text-gray-900 transition"
              >
                Sobre
              </button>
              <button
                onClick={() => scrollToSection("projetos")}
                className="text-gray-600 hover:text-gray-900 transition"
              >
                Projetos
              </button>
              <button
                onClick={() => scrollToSection("habilidades")}
                className="text-gray-600 hover:text-gray-900 transition"
              >
                Habilidades
              </button>
              <button
                onClick={() => scrollToSection("contato")}
                className="text-gray-600 hover:text-gray-900 transition"
              >
                Contato
              </button>
            </div>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-3 space-y-3">
              <button
                onClick={() => scrollToSection("sobre")}
                className="block w-full text-left text-gray-600 hover:text-gray-900"
              >
                Sobre
              </button>
              <button
                onClick={() => scrollToSection("projetos")}
                className="block w-full text-left text-gray-600 hover:text-gray-900"
              >
                Projetos
              </button>
              <button
                onClick={() => scrollToSection("habilidades")}
                className="block w-full text-left text-gray-600 hover:text-gray-900"
              >
                Habilidades
              </button>
              <button
                onClick={() => scrollToSection("contato")}
                className="block w-full text-left text-gray-600 hover:text-gray-900"
              >
                Contato
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section
        id="sobre"
        className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.name}
                className="w-32 h-32 mx-auto mb-6 rounded-full object-cover"
              />
            ) : (
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                {profile?.name?.charAt(0) || "P"}
              </div>
            )}
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              {profile?.title || "Desenvolvedor Full Stack"}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              {profile?.bio ||
                "Especializado em criar aplicações web modernas e escaláveis."}
            </p>
            {social_links && social_links.length > 0 && (
              <div className="flex justify-center space-x-4">
                {social_links.map((link: any) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition"
                  >
                    {getSocialIcon(link.platform)}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projetos" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Projetos em Destaque
          </h2>
          {projects && projects.length > 0 ? (
            <div className="space-y-16">
              {projects.map((project: any) => (
                <div
                  key={project.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden"
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="relative h-64 md:h-auto">
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {project.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {project.description}
                      </p>

                      {project.highlights && project.highlights.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            Destaques:
                          </h4>
                          <ul className="list-disc list-inside text-gray-600 space-y-1">
                            {project.highlights.map((highlight: any) => (
                              <li key={highlight.id} className="text-sm">
                                {highlight.highlight}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {project.challenges && (
                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            Desafio técnico:
                          </h4>
                          <p className="text-sm text-gray-600">
                            {project.challenges}
                          </p>
                        </div>
                      )}

                      {project.technologies &&
                        project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.technologies.map((tech: any) => (
                              <span
                                key={tech.id}
                                className="px-3 py-1 text-sm rounded-full text-white"
                                style={{ backgroundColor: tech.color }}
                              >
                                {tech.name}
                              </span>
                            ))}
                          </div>
                        )}

                      <div className="flex space-x-4">
                        {project.demo_url && (
                          <a
                            href={project.demo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                          >
                            <ExternalLink size={16} />
                            <span>Ver Demo</span>
                          </a>
                        )}
                        {project.github_url && (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
                          >
                            <Github size={16} />
                            <span>GitHub</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">
              Nenhum projeto disponível
            </p>
          )}
        </div>
      </section>

      {/* Skills Section */}
      <section id="habilidades" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Habilidades Técnicas
          </h2>
          {skills && Object.keys(skills).length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {Object.entries(skills).map(([category, items]: any[]) => (
                <div key={category} className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {category}
                  </h3>
                  <div className="space-y-2">
                    {items.map((skill: any) => (
                      <div
                        key={skill.id}
                        className="px-3 py-2 bg-white rounded border border-gray-200 text-gray-700 text-sm"
                      >
                        {skill.name}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">
              Nenhuma habilidade cadastrada
            </p>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contato"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100"
      >
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Vamos Trabalhar Juntos?
          </h2>
          <p className="text-lg text-gray-600 mb-8 text-center">
            Estou sempre aberto a novos projetos e oportunidades. Entre em
            contato!
          </p>

          <div className="bg-white rounded-lg shadow-lg p-8">
            {contactStatus.message && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  contactStatus.type === "success"
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : "bg-red-100 text-red-800 border border-red-200"
                }`}
              >
                {contactStatus.message}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome *
                </label>
                <input
                  type="text"
                  name="name"
                  value={contactForm.name}
                  onChange={handleContactChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={contactForm.email}
                  onChange={handleContactChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assunto
                </label>
                <input
                  type="text"
                  name="subject"
                  value={contactForm.subject}
                  onChange={handleContactChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mensagem *
                </label>
                <textarea
                  name="message"
                  value={contactForm.message}
                  onChange={handleContactChange}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <button
                onClick={handleContactSubmit}
                disabled={submitting}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <Mail size={20} />
                    <span>Enviar Mensagem</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400">
            © 2025 {profile?.name || "Portfolio"}. Desenvolvido com Next.js e
            Laravel
          </p>
        </div>
      </footer>
    </div>
  );
}
