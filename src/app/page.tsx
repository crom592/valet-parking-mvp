'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Home as HomeIcon, Plus, Search, MapPin, Key, Clock, LogOut, Check, Star, ChevronDown, Shield, Zap, Smartphone, Users, X } from 'lucide-react';
import { Vehicle } from '@/types/vehicle';
import { getParkedVehicles, getStats, addVehicle, retrieveVehicle, searchVehicle } from '@/lib/storage';

export default function Home() {
  const [view, setView] = useState<'landing' | 'app'>('landing');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [stats, setStats] = useState({ parked: 0, retrieved: 0, total: 0 });
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Vehicle[]>([]);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

  const [plateNumber, setPlateNumber] = useState('');
  const [keyLocation, setKeyLocation] = useState('');
  const [parkingSpot, setParkingSpot] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => { refreshData(); }, []);

  const refreshData = () => { setVehicles(getParkedVehicles()); setStats(getStats()); };
  const showToast = (message: string) => { setToast({ message, visible: true }); setTimeout(() => setToast(p => ({ ...p, visible: false })), 3000); };

  const handleCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plateNumber || !keyLocation || !parkingSpot) return;
    addVehicle({ plateNumber, keyLocation, parkingSpot, notes });
    setPlateNumber(''); setKeyLocation(''); setParkingSpot(''); setNotes('');
    setShowCheckIn(false);
    refreshData();
    showToast('입차 등록 완료! 🚗');
  };

  const handleCheckOut = (id: string) => {
    if (confirm('이 차량을 출차 처리하시겠습니까?')) {
      retrieveVehicle(id);
      refreshData();
      setSearchResults([]); setSearchQuery('');
      showToast('출차 완료! 👋');
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSearchResults(query.length >= 2 ? searchVehicle(query) : []);
  };

  // Landing
  if (view === 'landing') {
    const features = [
      { icon: Zap, title: '빠른 입출차', desc: '터치 몇 번으로 차량 등록 완료' },
      { icon: Search, title: '즉시 검색', desc: '번호판으로 빠른 차량 조회' },
      { icon: MapPin, title: '위치 추적', desc: '키 보관 위치까지 한눈에' },
      { icon: Smartphone, title: '모바일 최적화', desc: '현장에서 바로 사용' },
    ];
    const testimonials = [
      { name: '김대리', role: '발렛 매니저', text: '종이 대장 쓰다가 이거 쓰고 업무 효율이 2배가 됐어요!', rating: 5 },
      { name: '이파킹', role: '호텔 주차팀장', text: '손님 차량 찾는 시간이 절반으로 줄었습니다.', rating: 5 },
      { name: '박발렛', role: '레스토랑 발렛', text: '실수가 줄고 클레임도 거의 없어졌어요.', rating: 5 },
    ];
    const pricing = [
      { name: 'Basic', price: '₩39,000/월', features: ['직원 3명', '차량 무제한', '기본 통계', '모바일 앱'], cta: '시작하기', popular: false },
      { name: 'Pro', price: '₩79,000/월', features: ['직원 무제한', '상세 리포트', 'SMS 알림', '고객용 앱'], cta: '시작하기', popular: true },
      { name: 'Enterprise', price: '문의', features: ['모든 Pro 기능', '다중 지점', 'API 연동', '전담 지원'], cta: '문의하기', popular: false },
    ];

    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <section className="relative min-h-screen flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 via-transparent to-transparent" />
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-4xl z-10">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }} className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/50 rounded-full px-4 py-2 mb-6">
              <Car className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-300">발렛 파킹의 새로운 기준</span>
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">발렛 파킹<br/><span className="bg-gradient-to-r from-blue-400 via-cyan-500 to-teal-500 bg-clip-text text-transparent">스마트하게</span></h1>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">차량 입출차, 키 관리, 위치 추적을 한 곳에서.<br/>종이 대장은 이제 그만!</p>
            <motion.button onClick={() => setView('app')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg shadow-blue-500/25">대시보드 열기 →</motion.button>
          </motion.div>
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-8"><ChevronDown className="w-6 h-6 text-gray-500" /></motion.div>
        </section>

        <section className="py-24 px-4 bg-gray-900/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16">핵심 기능</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((f, i) => (
                <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 text-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4"><f.icon className="w-7 h-7 text-white" /></div>
                  <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                  <p className="text-gray-400">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16">사용자 후기</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
                  <div className="flex gap-1 mb-4">{[...Array(t.rating)].map((_, j) => <Star key={j} className="w-5 h-5 fill-yellow-500 text-yellow-500" />)}</div>
                  <p className="text-gray-300 mb-4">"{t.text}"</p>
                  <p className="font-bold">{t.name} <span className="text-gray-500 font-normal">· {t.role}</span></p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 px-4 bg-gray-900/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16">요금제</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {pricing.map((p, i) => (
                <motion.div key={p.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className={`relative bg-gray-800/50 border rounded-2xl p-6 ${p.popular ? 'border-blue-500 scale-105' : 'border-gray-700'}`}>
                  {p.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm px-4 py-1 rounded-full">인기</div>}
                  <h3 className="text-2xl font-bold mb-2">{p.name}</h3>
                  <p className="text-3xl font-bold mb-6">{p.price}</p>
                  <ul className="space-y-3 mb-6">{p.features.map(f => <li key={f} className="flex items-center gap-2 text-gray-300"><Check className="w-5 h-5 text-green-400" />{f}</li>)}</ul>
                  <button onClick={() => setView('app')} className={`w-full py-3 rounded-lg font-bold ${p.popular ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' : 'bg-gray-700 text-white'}`}>{p.cta}</button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <footer className="border-t border-gray-800 py-12 px-4 text-center text-gray-500 text-sm">© 2025 ValetPark. All rights reserved.</footer>
      </div>
    );
  }

  // App View
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center"><Car className="w-5 h-5 text-white" /></div>
            <h1 className="text-xl font-bold">ValetPark</h1>
          </div>
          <div className="flex items-center gap-2">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowCheckIn(true)} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2"><Plus className="w-4 h-4" />입차 등록</motion.button>
            <button onClick={() => setView('landing')} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white"><HomeIcon className="w-5 h-5" /></button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-800 rounded-xl p-4 border border-gray-700"><p className="text-gray-400 text-sm">현재 주차</p><p className="text-3xl font-bold text-green-400">{stats.parked}</p></motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gray-800 rounded-xl p-4 border border-gray-700"><p className="text-gray-400 text-sm">오늘 출차</p><p className="text-3xl font-bold text-blue-400">{stats.retrieved}</p></motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-gray-800 rounded-xl p-4 border border-gray-700"><p className="text-gray-400 text-sm">총 처리</p><p className="text-3xl font-bold text-purple-400">{stats.total}</p></motion.div>
        </div>

        {/* Search */}
        <div className="mb-6 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input type="text" placeholder="차량번호로 검색 (예: 1234)" value={searchQuery} onChange={(e) => handleSearch(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-12 pr-4 py-3 text-lg focus:outline-none focus:border-blue-500" />
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-xl border border-gray-700 overflow-hidden z-10">
              {searchResults.map((v) => (
                <div key={v.id} className="flex items-center justify-between p-4 border-b border-gray-700 last:border-0 hover:bg-gray-700/50">
                  <div><p className="font-bold">{v.plateNumber}</p><p className="text-sm text-gray-400">📍 {v.parkingSpot} | 🔑 {v.keyLocation}</p></div>
                  <button onClick={() => handleCheckOut(v.id)} className="bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1"><LogOut className="w-4 h-4" />출차</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Vehicle List */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-700"><h2 className="font-bold">현재 주차 중인 차량</h2></div>
          <div className="divide-y divide-gray-700">
            {vehicles.length === 0 ? (
              <div className="p-12 text-center text-gray-500">주차된 차량이 없습니다</div>
            ) : (
              vehicles.map((v, i) => (
                <motion.div key={v.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center justify-between p-4 hover:bg-gray-700/30 group">
                  <div className="flex-1">
                    <p className="text-lg font-bold">{v.plateNumber}</p>
                    <p className="text-sm text-gray-400 flex items-center gap-3">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{v.parkingSpot}</span>
                      <span className="flex items-center gap-1"><Key className="w-3 h-3" />{v.keyLocation}</span>
                      {v.notes && <span>📝 {v.notes}</span>}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><Clock className="w-3 h-3" />입차: {new Date(v.checkedInAt).toLocaleTimeString('ko-KR')}</p>
                  </div>
                  <button onClick={() => handleCheckOut(v.id)} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2"><LogOut className="w-4 h-4" />출차</button>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Check-in Modal */}
      <AnimatePresence>
        {showCheckIn && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowCheckIn(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()} className="bg-gray-800 rounded-2xl w-full max-w-md border border-gray-700">
              <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2"><Car className="w-5 h-5 text-blue-400" />입차 등록</h2>
                <button onClick={() => setShowCheckIn(false)} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleCheckIn} className="p-4 space-y-4">
                <div><label className="block text-sm text-gray-400 mb-1">차량번호 *</label><input type="text" value={plateNumber} onChange={(e) => setPlateNumber(e.target.value)} placeholder="12가 3456" className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3" required /></div>
                <div><label className="block text-sm text-gray-400 mb-1">키 보관 위치 *</label><input type="text" value={keyLocation} onChange={(e) => setKeyLocation(e.target.value)} placeholder="키박스 A-3" className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3" required /></div>
                <div><label className="block text-sm text-gray-400 mb-1">주차 위치 *</label><input type="text" value={parkingSpot} onChange={(e) => setParkingSpot(e.target.value)} placeholder="B구역 12번" className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3" required /></div>
                <div><label className="block text-sm text-gray-400 mb-1">메모</label><input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="특이사항 (선택)" className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3" /></div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 py-3 rounded-lg font-bold">입차 등록</motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast.visible && (
          <motion.div initial={{ opacity: 0, y: -50, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: -50, x: '-50%' }} className="fixed top-4 left-1/2 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border border-blue-500/50 bg-blue-500/10 backdrop-blur-sm">
            <Check className="w-5 h-5 text-blue-400" /><span className="text-white text-sm">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
