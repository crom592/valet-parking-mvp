'use client';

import { useState, useEffect } from 'react';
import { Vehicle } from '@/types/vehicle';
import { getParkedVehicles, getStats, addVehicle, retrieveVehicle, searchVehicle } from '@/lib/storage';

export default function Home() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [stats, setStats] = useState({ parked: 0, retrieved: 0, total: 0 });
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Vehicle[]>([]);

  // 폼 상태
  const [plateNumber, setPlateNumber] = useState('');
  const [keyLocation, setKeyLocation] = useState('');
  const [parkingSpot, setParkingSpot] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setVehicles(getParkedVehicles());
    setStats(getStats());
  };

  const handleCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plateNumber || !keyLocation || !parkingSpot) return;
    
    addVehicle({ plateNumber, keyLocation, parkingSpot, notes });
    setPlateNumber('');
    setKeyLocation('');
    setParkingSpot('');
    setNotes('');
    setShowCheckIn(false);
    refreshData();
  };

  const handleCheckOut = (id: string) => {
    if (confirm('이 차량을 출차 처리하시겠습니까?')) {
      retrieveVehicle(id);
      refreshData();
      setSearchResults([]);
      setSearchQuery('');
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      setSearchResults(searchVehicle(query));
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* 헤더 */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-blue-400">🚗 ValetPark</h1>
          <button
            onClick={() => setShowCheckIn(true)}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition"
          >
            + 입차 등록
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {/* 통계 카드 */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <p className="text-gray-400 text-sm">현재 주차</p>
            <p className="text-4xl font-bold text-green-400">{stats.parked}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <p className="text-gray-400 text-sm">오늘 출차</p>
            <p className="text-4xl font-bold text-blue-400">{stats.retrieved}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <p className="text-gray-400 text-sm">총 처리</p>
            <p className="text-4xl font-bold text-purple-400">{stats.total}</p>
          </div>
        </div>

        {/* 검색 */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="🔍 차량번호로 검색 (예: 1234)"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-blue-500"
          />
          {searchResults.length > 0 && (
            <div className="mt-2 bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              {searchResults.map((v) => (
                <div key={v.id} className="flex items-center justify-between p-4 border-b border-gray-700 last:border-0">
                  <div>
                    <p className="text-lg font-bold">{v.plateNumber}</p>
                    <p className="text-gray-400 text-sm">위치: {v.parkingSpot} | 키: {v.keyLocation}</p>
                  </div>
                  <button
                    onClick={() => handleCheckOut(v.id)}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-medium"
                  >
                    출차
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 주차 현황 */}
        <div className="bg-gray-800 rounded-xl border border-gray-700">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-lg font-bold">현재 주차 중인 차량</h2>
          </div>
          <div className="divide-y divide-gray-700">
            {vehicles.length === 0 ? (
              <p className="p-8 text-center text-gray-500">주차된 차량이 없습니다</p>
            ) : (
              vehicles.map((v) => (
                <div key={v.id} className="flex items-center justify-between p-4 hover:bg-gray-750">
                  <div className="flex-1">
                    <p className="text-lg font-bold">{v.plateNumber}</p>
                    <p className="text-gray-400 text-sm">
                      📍 {v.parkingSpot} | 🔑 {v.keyLocation}
                      {v.notes && <span> | 📝 {v.notes}</span>}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      입차: {new Date(v.checkedInAt).toLocaleTimeString('ko-KR')}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCheckOut(v.id)}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-medium ml-4"
                  >
                    출차
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* 입차 등록 모달 */}
      {showCheckIn && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl w-full max-w-md border border-gray-700">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold">🚗 입차 등록</h2>
              <button onClick={() => setShowCheckIn(false)} className="text-gray-400 hover:text-white text-2xl">
                ×
              </button>
            </div>
            <form onSubmit={handleCheckIn} className="p-4 space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">차량번호 *</label>
                <input
                  type="text"
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value)}
                  placeholder="12가 3456"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">키 보관 위치 *</label>
                <input
                  type="text"
                  value={keyLocation}
                  onChange={(e) => setKeyLocation(e.target.value)}
                  placeholder="키박스 A-3"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">주차 위치 *</label>
                <input
                  type="text"
                  value={parkingSpot}
                  onChange={(e) => setParkingSpot(e.target.value)}
                  placeholder="B구역 12번"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">메모</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="특이사항 (선택)"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold text-lg transition"
              >
                입차 등록
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
