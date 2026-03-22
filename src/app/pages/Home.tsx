import React, { useState } from 'react';
import { useApp, Service, User } from '../context/AppContext';
import { Search, MapPin, Star, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router';

export function Home() {
  const { services, users } = useApp();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Get active providers mapping
  const activeProviders = users.reduce((acc, user) => {
    if (user.isProvider && user.providerInfo && !user.providerInfo.suspended) {
      acc[user.id] = user;
    }
    return acc;
  }, {} as Record<string, User>);

  const activeServices = services.filter(s => activeProviders[s.providerId]);

  const categories = Array.from(new Set(activeServices.map(s => s.category)));

  const filteredServices = activeServices.filter(s => {
    const provider = activeProviders[s.providerId];
    const matchesSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          provider.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = provider.providerInfo!.location.toLowerCase().includes(locationTerm.toLowerCase());
    const matchesCategory = categoryFilter ? s.category === categoryFilter : true;
    
    return matchesSearch && matchesLocation && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Hero Search Section */}
      <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Encuentra a los mejores profesionales</h1>
        <p className="text-blue-100 mb-8 max-w-2xl">Desde plomería hasta clases particulares. Todo lo que necesitas a un clic de distancia, con la confianza y seguridad de nuestra comunidad.</p>
        
        <div className="flex flex-col md:flex-row gap-4 bg-white p-3 rounded-2xl md:rounded-full shadow-lg">
          <div className="flex-1 flex items-center px-4 bg-neutral-100 rounded-xl md:rounded-full md:bg-transparent">
            <Search className="text-neutral-400 mr-2" size={20} />
            <input 
              type="text" 
              placeholder="¿Qué servicio buscas?" 
              className="w-full py-3 bg-transparent text-neutral-900 focus:outline-none placeholder-neutral-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-px bg-neutral-200 hidden md:block"></div>
          <div className="flex-1 flex items-center px-4 bg-neutral-100 rounded-xl md:rounded-full md:bg-transparent">
            <MapPin className="text-neutral-400 mr-2" size={20} />
            <input 
              type="text" 
              placeholder="Ubicación o Zona" 
              className="w-full py-3 bg-transparent text-neutral-900 focus:outline-none placeholder-neutral-500"
              value={locationTerm}
              onChange={(e) => setLocationTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Categories Filter */}
      <div className="flex flex-wrap gap-2">
        <button 
          onClick={() => setCategoryFilter('')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${categoryFilter === '' ? 'bg-neutral-900 text-white' : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'}`}
        >
          Todos
        </button>
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${categoryFilter === cat ? 'bg-neutral-900 text-white' : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results */}
      <div>
        <h2 className="text-xl font-bold text-neutral-900 mb-6">Servicios Destacados ({filteredServices.length})</h2>
        {filteredServices.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-neutral-200">
            <p className="text-neutral-500">No se encontraron servicios que coincidan con tu búsqueda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map(service => {
              const provider = activeProviders[service.providerId];
              return (
                <div key={service.id} className="bg-white rounded-2xl border border-neutral-200 p-5 hover:shadow-lg transition-all flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">{service.category}</span>
                    <span className="font-bold text-lg text-neutral-900">${service.cost}</span>
                  </div>
                  
                  <h3 className="font-bold text-lg text-neutral-900 mb-2">{service.title}</h3>
                  <p className="text-sm text-neutral-500 mb-4 line-clamp-2 flex-1">{service.description}</p>
                  
                  <div className="border-t border-neutral-100 pt-4 mt-auto">
                    <div className="flex items-center justify-between">
                      <div 
                        className="flex items-center space-x-3 cursor-pointer group"
                        onClick={() => navigate(`/provider/${provider.id}`)}
                      >
                        <div className="w-10 h-10 bg-neutral-200 rounded-full flex items-center justify-center text-neutral-600 font-bold group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                          {provider.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">{provider.name}</p>
                          <div className="flex items-center text-xs text-neutral-500 space-x-2">
                            <span className="flex items-center"><Star size={12} className="text-yellow-400 mr-1 fill-yellow-400" /> {provider.providerInfo!.rating}</span>
                            <span>•</span>
                            <span className="flex items-center"><MapPin size={12} className="mr-1" /> {provider.providerInfo!.location}</span>
                          </div>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => navigate(`/provider/${provider.id}`)}
                        className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
                      >
                        Ver más
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
