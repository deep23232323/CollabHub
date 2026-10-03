import React, { useEffect, useState } from 'react';
import { UserRole } from '../types';
import { useSelector } from "react-redux";
import { GoogleLoginButton, AuthUser } from './GoogleLoginButton';
import { 
  Sparkles, 
  Users, 
  User,
  Briefcase, 
  FileText, 
  BarChart3, 
  ShieldAlert,
  Wallet,
  MessageSquare,
  Building2,
  UserCheck,
  Globe,
  Share2,
  Menu,
  X
} from 'lucide-react';

interface RootState {
  user?: {
    data?: any;
  };
}

interface NavItem {
  id: string;
  label: string;
  icon: any;
  hasUnread?: boolean;
  badge?: string;
}

interface NavbarProps {
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadMessagesCount: number;
  openAIMatchModal: () => void;
  openCampaignModal: () => void;
  onAuthUserChange?: (user: AuthUser | null) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onSelectRole,
  activeTab,
  setActiveTab,
  unreadMessagesCount,
  openAIMatchModal,
  openCampaignModal,
  onAuthUserChange
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  const user = useSelector((state: RootState) => state.user?.data);

  useEffect(() => {
    setRole(user?.role);
  }, [user]);

  const navItems: NavItem[] = [
    { id: 'directory', label: 'Creators', icon: Users },
    { id: 'collab', label: 'Collab Hub', icon: Share2 },
    { id: 'campaigns', label: 'Campaigns', icon: Briefcase },
    { id: 'contracts', label: 'Contracts', icon: FileText },
    { id: 'analytics', label: 'Social Blade', icon: BarChart3 },
    { id: 'messages', label: 'Offers', icon: MessageSquare, hasUnread: unreadMessagesCount > 0 },
    { id: 'escrow', label: 'Escrow', icon: Wallet },
    { id: 'profile', label: 'My Profile', icon: User }
  ];

  const filteredNavItems = navItems.filter((item) => {
  if (user?.role === "creator" && item.id === "directory") {
    return false;
  }

  if (user?.role === "brand" && item.id === "collab") {
    return false;
  }

  return true;
});

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          
          {/* Brand Logo & Name */}
          <div 
            className="flex items-center space-x-2.5 cursor-pointer shrink-0 -ml-6" 
            onClick={() => setActiveTab('directory')}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white font-black text-lg shadow-md ring-1 ring-white/20">
              CP
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white">
                  CreatorCave
                </span>
                <span className="hidden xs:inline-block px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  AI SaaS
                </span>
              </div>
              <p className="text-[10px] text-slate-400 -mt-0.5 hidden xl:block">
                Collabs • Campaigns 
              </p>
            </div>
          </div>

          {/* Responsive Navigation Tabs (Visible on MD, LG, XL) */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5 overflow-x-auto no-scrollbar py-1">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-2.5 lg:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden lg:inline">{item.label}</span>
                  <span className="inline lg:hidden">{item.label === 'Social Blade' ? 'Blade' : item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 text-[9px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                      {item.badge}
                    </span>
                  )}
                  {item.hasUnread && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Section: AI Match, Role Switcher, Auth & Mobile Menu Toggle */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            
            {/* AI Matchmaker */}
            {/* <button
              id="btn-ai-match"
              onClick={openAIMatchModal}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin" style={{ animationDuration: '4s' }} />
              <span className="hidden md:inline">AI Matchmaker</span>
            </button> */}

            {/* Role Switcher Dropdown */}
            <div className="relative group">
              <div className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700/80 px-2.5 py-1.5 rounded-xl border border-slate-700 cursor-pointer transition-colors text-white">
                <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                <div className="text-left">
                  <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold hidden sm:block">Role</div>
                  <div className="text-xs font-bold text-white capitalize flex items-center space-x-1">
                    <span>{role}</span>
                  </div>
                </div>
              </div>

              {/* Persona Options Dropdown Menu */}
              <div className="absolute right-0 top-full mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 hidden group-hover:block z-50">
                <div className="text-[10px] font-extrabold text-slate-400 uppercase px-2 py-1 tracking-wider">
                  Switch Role Persona
                </div>
                
                <button
                  onClick={() => onSelectRole('brand')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                    currentRole === 'brand' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-indigo-400" />
                    <span>Nike (Brand)</span>
                  </div>
                  {currentRole === 'brand' && <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">Active</span>}
                </button>

                <button
                  onClick={() => onSelectRole('creator')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                    currentRole === 'creator' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                    <span>Alex Rivera (Creator)</span>
                  </div>
                  {currentRole === 'creator' && <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">Active</span>}
                </button>

                <button
                  onClick={() => onSelectRole('agency')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                    currentRole === 'agency' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-cyan-400" />
                    <span>Vantage Media (Agency)</span>
                  </div>
                  {currentRole === 'agency' && <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">Active</span>}
                </button>

                <button
                  onClick={() => onSelectRole('admin')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                    currentRole === 'admin' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    <span>Platform Admin</span>
                  </div>
                  {currentRole === 'admin' && <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">Active</span>}
                </button>
              </div>
            </div>

            {/* Google Authentication Button */}
            <div className="max-w-[170px] sm:max-w-none">
              <GoogleLoginButton onAuthChange={onAuthUserChange} />
            </div>

            {/* Mobile / Tablet Menu Button Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile/Tablet Drawer Menu when toggle is open */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 py-3 space-y-2 animate-fadeIn">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2">Navigation</div>
          <div className="grid grid-cols-2 gap-2">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`p-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
                    isActive ? 'bg-indigo-600 text-white' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0 text-indigo-400" />
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 text-[9px] font-extrabold bg-emerald-500/20 text-emerald-300 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

         
        </div>
      )}

      {/* Fixed Bottom Quick Navigation Bar for Mobile */}
      <div className="md:hidden flex items-center justify-around bg-slate-900 border-t border-slate-800 py-2 px-1 text-[11px]">
        <button
          onClick={() => setActiveTab('directory')}
          className={`flex flex-col items-center space-y-0.5 ${activeTab === 'directory' ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}
        >
          <Users className="w-4 h-4" />
          <span>Creators</span>
        </button>

        <button
          onClick={() => setActiveTab('collab')}
          className={`flex flex-col items-center space-y-0.5 ${activeTab === 'collab' ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}
        >
          <Share2 className="w-4 h-4" />
          <span>Collabs</span>
        </button>

        <button
          onClick={() => setActiveTab('campaigns')}
          className={`flex flex-col items-center space-y-0.5 ${activeTab === 'campaigns' ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Campaigns</span>
        </button>

        <button
          onClick={() => setActiveTab('contracts')}
          className={`flex flex-col items-center space-y-0.5 ${activeTab === 'contracts' ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}
        >
          <FileText className="w-4 h-4" />
          <span>Contracts</span>
        </button>

        <button
          onClick={() => setActiveTab('messages')}
          className={`flex flex-col items-center space-y-0.5 relative ${activeTab === 'messages' ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Offers</span>
        </button>
      </div>
    </header>
  );
};
