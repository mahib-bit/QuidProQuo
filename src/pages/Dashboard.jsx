import React, { useContext, useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { AuthContext } from '../context/AuthContext';
import { authenticatedFetch } from '../api/api';
import { Link } from 'react-router';
import {
  LogOut,
  Package,
  Send,
  Inbox,
  FileText,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

// Safely pull an array out of a response body.
// Handles: [ ... ], { requests: [ ... ] }, { data: [ ... ] }, { items: [ ... ] }, etc.
const extractList = (body, keys = []) => {
  if (Array.isArray(body)) return body;
  if (body && typeof body === 'object') {
    for (const key of [...keys, 'data', 'results']) {
      if (Array.isArray(body[key])) return body[key];
    }
  }
  return [];
};

// Fetch one endpoint and return a list. Logs real failures instead of hiding them.
const fetchList = async (user, path, keys = []) => {
  try {
    const res = await authenticatedFetch(user, path);
    if (!res.ok) {
      console.error(`GET ${path} failed with status ${res.status}`);
      return [];
    }
    const body = await res.json();
    return extractList(body, keys);
  } catch (err) {
    console.error(`GET ${path} threw:`, err);
    return [];
  }
};

// Statuses that mean "this request is no longer waiting for the owner".
// Adjust these to match the exact values stored in your MongoDB documents.
const NOT_INCOMING_STATUSES = [
  'accepted',
  'approved',
  'lending',
  'lent',
  'borrowed',
  'returned',
  'rejected',
  'declined',
  'cancelled',
  'canceled',
];

const normalize = (value) => String(value || '').trim().toLowerCase();

// A request counts as "incoming" only if neither the request itself nor its
// item is already in a lent-out / finished state.
const isStillIncoming = (req) => {
  const requestStatus = normalize(req.status);
  const itemStatus = normalize(req.item?.status);
  return (
    !NOT_INCOMING_STATUSES.includes(requestStatus) &&
    !NOT_INCOMING_STATUSES.includes(itemStatus)
  );
};

const Dashboard = () => {
  const { user, mongoUser, loading } = useContext(AuthContext);

  // Core metrics state for the top 4 overview cards
  const [stats, setStats] = useState({
    itemsCount: 0,
    sentRequestsCount: 0,
    incomingRequestsCount: 0,
    agreementsCount: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // Fetch metrics dynamically for logged-in user
  const fetchDashboardStats = async () => {
    if (!user || !mongoUser) return;

    try {
      setStatsLoading(true);

      // Fetch all required endpoints concurrently
      const [itemsList, sentList, incomingList, agreementsList] = await Promise.all([
        fetchList(user, '/items', ['items']),
        fetchList(user, '/requests/my', ['requests']),
        fetchList(user, '/requests/incoming', ['requests']),
        fetchList(user, '/agreements/my', ['agreements']),
      ]);

      // 1. My Listed Items Count (the /items endpoint returns everyone's items)
      const myItemsCount = itemsList.filter((item) => {
        const ownerId = item.owner?._id || item.owner;
        return String(ownerId) === String(mongoUser._id);
      }).length;

      // 2. Incoming Requests Count
      // The /requests/incoming endpoint already returns only requests on items
      // the logged-in user owns. On top of that, we only count requests that are
      // still waiting for a decision: once accepted (it moves to agreements and
      // the item shows as "lending"), it no longer counts as incoming.
      const pendingIncomingCount = incomingList.filter(isStillIncoming).length;

      setStats({
        itemsCount: myItemsCount,
        sentRequestsCount: sentList.length,
        incomingRequestsCount: pendingIncomingCount,
        agreementsCount: agreementsList.length,
      });
    } catch (error) {
      console.error('Failed to load dashboard metrics:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, mongoUser]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/60 flex items-center justify-center font-sans">
        <div className="flex items-center gap-3 px-6 py-4 bg-white border-2 border-blue-900/20 rounded-2xl shadow-sm text-blue-950 font-serif font-bold text-sm">
          <span className="animate-spin text-blue-900">❖</span>
          <span>Loading Member Dashboard...</span>
        </div>
      </div>
    );
  }

  const userInitial = mongoUser?.name
    ? mongoUser.name.charAt(0).toUpperCase()
    : user?.email?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-slate-50/60 text-blue-950 font-sans py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header Banner */}
        <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-double border-blue-300/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white text-blue-950 font-serif font-bold text-2xl flex items-center justify-center shadow-md border-2 border-blue-200 shrink-0">
              {userInitial}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-serif uppercase tracking-widest text-blue-200 bg-blue-900/80 px-2.5 py-0.5 rounded-full border border-blue-400/30">
                  Active Member
                </span>
                <span className="text-xs text-blue-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-300" /> Synchronized
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                Welcome back, {mongoUser?.name || 'Member'}
              </h1>
              <p className="text-xs text-blue-200">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchDashboardStats}
              title="Refresh Stats"
              className="p-2.5 bg-blue-900/80 hover:bg-blue-800 text-white rounded-xl border border-blue-300/40 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${statsLoading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2.5 bg-blue-900/80 hover:bg-red-900/80 text-white text-xs font-semibold rounded-xl border border-blue-300/40 hover:border-red-300/50 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-red-300" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* MERGED METRICS & NAVIGATION HUB */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b-2 border-blue-100 pb-2">
            <span className="text-blue-900 font-serif">❖</span>
            <h2 className="text-xl font-serif font-bold text-blue-950">Overview & Quick Access</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

            {/* Card 1: My Listed Items */}
            <Link
              to="/items"
              className="group bg-white border-2 border-blue-900/20 hover:border-blue-900 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 flex items-center justify-center">
                    <Package className="w-5 h-5" />
                  </div>
                  <span className="text-3xl font-serif font-bold text-blue-950">
                    {statsLoading ? '...' : stats.itemsCount}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif font-bold text-base text-blue-950 group-hover:text-blue-700 transition-colors">
                    My Listed Items
                  </h3>
                  <p className="text-xs text-blue-900/70 mt-1">
                    Manage tool inventory, edit specs, or register new items.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-blue-100 flex items-center justify-between text-xs font-semibold text-blue-900">
                <span>Manage Catalog</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-blue-700" />
              </div>
            </Link>

            {/* Card 2: Sent Requests */}
            <Link
              to="/my-requests"
              className="group bg-white border-2 border-blue-900/20 hover:border-blue-900 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 flex items-center justify-center">
                    <Send className="w-5 h-5" />
                  </div>
                  <span className="text-3xl font-serif font-bold text-blue-950">
                    {statsLoading ? '...' : stats.sentRequestsCount}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif font-bold text-base text-blue-950 group-hover:text-blue-700 transition-colors">
                    Sent Requests
                  </h3>
                  <p className="text-xs text-blue-900/70 mt-1">
                    Track status of borrow requests submitted to neighbors.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-blue-100 flex items-center justify-between text-xs font-semibold text-blue-900">
                <span>View My Requests</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-blue-700" />
              </div>
            </Link>

            {/* Card 3: Incoming Requests */}
            <Link
              to="/incoming-requests"
              className="group bg-white border-2 border-blue-900/20 hover:border-blue-900 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 flex items-center justify-center">
                    <Inbox className="w-5 h-5" />
                  </div>
                  <span className="text-3xl font-serif font-bold text-blue-950">
                    {statsLoading ? '...' : stats.incomingRequestsCount}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif font-bold text-base text-blue-950 group-hover:text-blue-700 transition-colors">
                    Incoming Requests
                  </h3>
                  <p className="text-xs text-blue-900/70 mt-1">
                    Review and approve requests on items you own.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-blue-100 flex items-center justify-between text-xs font-semibold text-blue-900">
                <span>Review Requests</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-blue-700" />
              </div>
            </Link>

            {/* Card 4: Agreements */}
            <Link
              to="/my-agreements"
              className="group bg-white border-2 border-blue-900/20 hover:border-blue-900 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-3xl font-serif font-bold text-blue-950">
                    {statsLoading ? '...' : stats.agreementsCount}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif font-bold text-base text-blue-950 group-hover:text-blue-700 transition-colors">
                    Active Agreements
                  </h3>
                  <p className="text-xs text-blue-900/70 mt-1">
                    Monitor active contracts, return dates, and status.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-blue-100 flex items-center justify-between text-xs font-semibold text-blue-900">
                <span>View Contracts</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-blue-700" />
              </div>
            </Link>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;