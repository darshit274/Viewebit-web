import React, { useEffect, useState } from 'react';
import { AcademicCapIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { certificatesService } from '../../services/certificates';
import type { Certificate } from '../../services/certificates';
import toast from 'react-hot-toast';

const CertificatesPage: React.FC = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await certificatesService.getMyCertificates();
        setCertificates(data);
      } catch (error) {
        console.error('Failed to load certificates:', error);
        toast.error('Failed to load certificates');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">My Certificates</h1>
        <p className="text-gray-600">Certificates earned by completing courses</p>
      </div>

      {certificates.length === 0 ? (
        <div className="card p-12 text-center">
          <AcademicCapIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No certificates yet</h3>
          <p className="text-gray-600">Complete a course to earn your first certificate.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {certificates.map((cert) => (
            <div key={cert.uuid} className="card p-6 text-center">
              <AcademicCapIcon className="h-12 w-12 text-primary-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">{cert.course.title}</h3>
              <p className="text-xs text-gray-500 mb-1">Certificate No: {cert.certificate_number}</p>
              <p className="text-xs text-gray-500 mb-4">Issued {new Date(cert.issued_at).toLocaleDateString()}</p>
              {cert.pdf_url && (
                <a
                  href={cert.pdf_url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary inline-flex items-center gap-2 text-sm"
                >
                  <ArrowDownTrayIcon className="h-4 w-4" />
                  Download
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CertificatesPage;
