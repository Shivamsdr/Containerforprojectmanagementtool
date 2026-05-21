import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, UserPlus, Check, X, Loader2 } from "lucide-react";
import { useInvitations } from "../hooks/useInvitations";

export default function NotificationPanel({ isOpen, onClose, anchorRef }) {
  const panelRef = useRef(null);
  const navigate = useNavigate();
  const { invitations, accept, decline, isAccepting, isDeclining, refetch } = useInvitations();

  useEffect(() => {
    if (isOpen) refetch();
  }, [isOpen, refetch]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        isOpen &&
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        anchorRef?.current &&
        !anchorRef.current.contains(e.target)
      ) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose, anchorRef]);

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      className="fixed top-20 right-4 left-4 sm:absolute sm:top-full sm:right-0 sm:left-auto sm:mt-2 sm:w-96 max-h-[80vh] overflow-hidden bg-white rounded-xl shadow-xl border border-gray-200 z-[100] flex flex-col sm:origin-top-right transition-all"
    >
      <div className="p-4 border-b border-gray-100 flex items-center gap-2">
        <Bell size={20} className="text-gray-600" />
        <h3 className="font-semibold text-gray-900">Notifications</h3>
      </div>
      <div className="overflow-y-auto flex-1">
        {invitations.length === 0 ? (
          <div className="p-6 text-center text-gray-500 text-sm">
            No new notifications
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {invitations.map((inv) => (
              <li key={inv._id} className="p-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <UserPlus size={18} className="text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{inv.inviter?.name ?? "Someone"}</span>
                      {" invited you to "}
                      <span className="font-medium">{inv.project?.name ?? "a project"}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={async () => {
                          await accept(inv._id);
                          onClose();
                          const projectId = inv.project?._id ?? inv.project;
                          navigate(`/dashboard?project=${projectId}&view=board`);
                        }}
                        disabled={isAccepting || isDeclining}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                      >
                        {isAccepting ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                        Accept
                      </button>
                      <button
                        onClick={async () => {
                          await decline(inv._id);
                        }}
                        disabled={isAccepting || isDeclining}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50"
                      >
                        <X size={14} />
                        Decline
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
