import React, { useEffect, useState } from 'react';
import { VideoCameraIcon, ClockIcon } from '@heroicons/react/24/outline';
import { liveSessionsService } from '../../services/liveSessions';
import type { LiveSession } from '../../services/liveSessions';
import toast from 'react-hot-toast';

const STATUS_BADGE: Record<LiveSession['status'], string> = {
  scheduled: 'badge-blue',
  live: 'badge-red',
  completed: 'badge-green',
  cancelled: 'badge-yellow',
};

const LiveSessionsPage: React.FC = () => {
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [joiningUuid, setJoiningUuid] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await liveSessionsService.getUpcoming();
        setSessions(data);
      } catch (error) {
        console.error('Failed to load live sessions:', error);
        toast.error('Failed to load live sessions');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleJoin = async (session: LiveSession) => {
    setJoiningUuid(session.uuid);
    try {
      const { meeting_url } = await liveSessionsService.join(session.uuid);
      window.open(meeting_url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      toast.error('Failed to join session');
    } finally {
      setJoiningUuid(null);
    }
  };

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
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Live & Recorded Sessions</h1>
        <p className="text-gray-600">Join your instructors' live classes</p>
      </div>

      {sessions.length === 0 ? (
        <div className="card p-12 text-center">
          <VideoCameraIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No live sessions scheduled</h3>
          <p className="text-gray-600">Check back later for upcoming classes.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <div key={session.uuid} className="card p-5 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{session.title}</h3>
                <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                  <ClockIcon className="h-4 w-4" />
                  {new Date(session.scheduled_start).toLocaleString()}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`badge ${STATUS_BADGE[session.status]}`}>{session.status}</span>
                  {session.course && <span className="text-xs text-gray-500">{session.course.title}</span>}
                  <span className="text-xs text-gray-500">by {session.educator.name}</span>
                </div>
              </div>
              <button
                onClick={() => handleJoin(session)}
                disabled={joiningUuid === session.uuid || session.status === 'completed' || session.status === 'cancelled'}
                className="btn-primary disabled:opacity-50"
              >
                {joiningUuid === session.uuid ? 'Joining...' : 'Join'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LiveSessionsPage;
