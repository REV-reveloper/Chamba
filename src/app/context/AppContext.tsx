import React, { createContext, useContext, useState, ReactNode } from 'react';

export type User = {
  id: string;
  name: string;
  isProvider: boolean;
  providerInfo?: {
    age: number;
    hasTransport: boolean;
    radiusKm: number;
    location: string;
    lat: number;
    lng: number;
    suspended: boolean;
    rating: number;
    jobsCompleted: number;
    email: string;
    phone: string;
    workingHours: string;
    reviews: { author: string; comment: string; rating: number }[];
  };
};

export type Service = {
  id: string;
  providerId: string;
  title: string;
  description: string;
  cost: number;
  category: string;
};

export type RequestStatus = 'active' | 'canceled' | 'finished';
export type PaymentStatus = 'pending' | 'reported' | 'validated';

export type ServiceRequest = {
  id: string;
  clientId: string;
  providerId: string;
  serviceId: string;
  status: RequestStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
};

export type ChatMessage = {
  id: string;
  requestId: string;
  senderId: string;
  text: string;
  timestamp: string;
};

type AppState = {
  currentUser: User;
  users: User[];
  services: Service[];
  requests: ServiceRequest[];
  messages: ChatMessage[];
};

type AppContextType = AppState & {
  switchUser: (id: string) => void;
  becomeProvider: (info: User['providerInfo']) => void;
  toggleSuspension: () => void;
  addService: (service: Omit<Service, 'id' | 'providerId'>) => void;
  createRequest: (providerId: string, serviceId: string) => void;
  updateRequestStatus: (requestId: string, status: RequestStatus) => void;
  reportPayment: (requestId: string) => void;
  validatePayment: (requestId: string) => void;
  sendMessage: (requestId: string, text: string) => void;
};

const defaultUsers: User[] = [
  {
    id: 'u1',
    name: 'Ana Client',
    isProvider: false,
  },
  {
    id: 'u2',
    name: 'Carlos Provider',
    isProvider: true,
    providerInfo: {
      age: 34,
      hasTransport: true,
      radiusKm: 20,
      location: 'Centro, Ciudad (Madrid)',
      lat: 40.4168,
      lng: -3.7038,
      suspended: false,
      rating: 4.8,
      jobsCompleted: 15,
      email: 'carlos@ejemplo.com',
      phone: '+1234567890',
      workingHours: 'Lunes a Viernes 08:00 - 18:00',
      reviews: [
        { author: 'María', comment: 'Excelente trabajo con la electricidad.', rating: 5 },
      ],
    },
  },
  {
    id: 'u3',
    name: 'Pedro Cleaning',
    isProvider: true,
    providerInfo: {
      age: 28,
      hasTransport: false,
      radiusKm: 5,
      location: 'Norte, Ciudad (Madrid Norte)',
      lat: 40.4536,
      lng: -3.6905,
      suspended: false,
      rating: 4.2,
      jobsCompleted: 3,
      email: 'pedro@ejemplo.com',
      phone: '+0987654321',
      workingHours: 'Fines de semana',
      reviews: [],
    },
  },
];

const defaultServices: Service[] = [
  {
    id: 's1',
    providerId: 'u2',
    title: 'Reparación Eléctrica General',
    description: 'Arreglo de cortocircuitos, instalación de tomacorrientes y revisión de cableado.',
    cost: 50,
    category: 'Electricidad',
  },
  {
    id: 's2',
    providerId: 'u2',
    title: 'Instalación de Lámparas',
    description: 'Instalación de lámparas de techo y pared.',
    cost: 30,
    category: 'Electricidad',
  },
  {
    id: 's3',
    providerId: 'u3',
    title: 'Limpieza Profunda de Hogar',
    description: 'Limpieza de baños, cocina y áreas comunes.',
    cost: 40,
    category: 'Limpieza',
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(defaultUsers);
  const [services, setServices] = useState<Service[]>(defaultServices);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>('u1');

  const currentUser = users.find((u) => u.id === currentUserId) || users[0];

  const switchUser = (id: string) => setCurrentUserId(id);

  const becomeProvider = (info: User['providerInfo']) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === currentUser.id ? { ...u, isProvider: true, providerInfo: info } : u
      )
    );
  };

  const toggleSuspension = () => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === currentUser.id && u.providerInfo) {
          return {
            ...u,
            providerInfo: { ...u.providerInfo, suspended: !u.providerInfo.suspended },
          };
        }
        return u;
      })
    );
  };

  const addService = (serviceData: Omit<Service, 'id' | 'providerId'>) => {
    const newService: Service = {
      ...serviceData,
      id: `s${Date.now()}`,
      providerId: currentUser.id,
    };
    setServices((prev) => [...prev, newService]);
  };

  const createRequest = (providerId: string, serviceId: string) => {
    const newReq: ServiceRequest = {
      id: `r${Date.now()}`,
      clientId: currentUser.id,
      providerId,
      serviceId,
      status: 'active',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
    };
    setRequests((prev) => [...prev, newReq]);
  };

  const updateRequestStatus = (requestId: string, status: RequestStatus) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status } : r))
    );
  };

  const reportPayment = (requestId: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, paymentStatus: 'reported' } : r))
    );
  };

  const validatePayment = (requestId: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, paymentStatus: 'validated' } : r))
    );
  };

  const sendMessage = (requestId: string, text: string) => {
    const newMsg: ChatMessage = {
      id: `m${Date.now()}`,
      requestId,
      senderId: currentUser.id,
      text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        services,
        requests,
        messages,
        switchUser,
        becomeProvider,
        toggleSuspension,
        addService,
        createRequest,
        updateRequestStatus,
        reportPayment,
        validatePayment,
        sendMessage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}
