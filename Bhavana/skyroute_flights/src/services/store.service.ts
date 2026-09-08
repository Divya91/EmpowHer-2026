import { Airport, Airline, FlightResponseDto, SeatDto, BookingResponseDto, User, NotificationDto, RefundDto, AdminDashboardDto, ChatMessageDto } from '../types';

export class SkyRouteStore {
  private static instance: SkyRouteStore;

  public airports: Airport[] = [
    { id: 1, iataCode: 'BLR', name: 'Kempegowda International Airport', city: 'Bengaluru', country: 'India' },
    { id: 2, iataCode: 'DEL', name: 'Indira Gandhi International Airport', city: 'New Delhi', country: 'India' },
    { id: 3, iataCode: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Airport', city: 'Mumbai', country: 'India' },
    { id: 4, iataCode: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'United Arab Emirates' },
    { id: 5, iataCode: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore' },
    { id: 6, iataCode: 'LHR', name: 'London Heathrow Airport', city: 'London', country: 'United Kingdom' },
    { id: 7, iataCode: 'HYD', name: 'Rajiv Gandhi International Airport', city: 'Hyderabad', country: 'India' },
    { id: 8, iataCode: 'MAA', name: 'Chennai International Airport', city: 'Chennai', country: 'India' },
    { id: 9, iataCode: 'CCU', name: 'Netaji Subhash Chandra Bose Intl Airport', city: 'Kolkata', country: 'India' },
    { id: 10, iataCode: 'GOI', name: 'Dabolim Airport', city: 'Goa', country: 'India' },
  ];

  public airlines: Airline[] = [
    { id: 1, iataCode: '6E', name: 'IndiGo', logoUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=120&q=80' },
    { id: 2, iataCode: 'AI', name: 'Air India', logoUrl: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=120&q=80' },
    { id: 3, iataCode: 'EK', name: 'Emirates', logoUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=120&q=80' },
    { id: 4, iataCode: 'SQ', name: 'Singapore Airlines', logoUrl: 'https://images.unsplash.com/photo-1520437358207-323b43b50729?auto=format&fit=crop&w=120&q=80' },
    { id: 5, iataCode: 'QP', name: 'Akasa Air', logoUrl: 'https://images.unsplash.com/photo-1517479149777-5f3b1511d7ad?auto=format&fit=crop&w=120&q=80' },
    { id: 6, iataCode: 'BA', name: 'British Airways', logoUrl: 'https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?auto=format&fit=crop&w=120&q=80' }
  ];

  public flights: FlightResponseDto[] = [
    {
      id: 1,
      scheduleId: 101,
      flightNumber: '6E-1234',
      airlineName: 'IndiGo',
      airlineCode: '6E',
      airlineLogo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=120&q=80',
      originIata: 'BLR',
      originCity: 'Bengaluru',
      originAirportName: 'Kempegowda International Airport',
      destinationIata: 'DEL',
      destinationCity: 'New Delhi',
      destinationAirportName: 'Indira Gandhi International Airport',
      departureTime: '06:30',
      arrivalTime: '09:20',
      travelDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      durationMinutes: 170,
      stops: 0,
      baseFare: 5800,
      taxAmount: 699,
      totalPrice: 6499,
      isRefundable: true,
      cabinBaggageKg: 7,
      checkinBaggageKg: 15,
      availableSeats: 142,
      aircraftModel: 'Airbus A320neo',
      cabinClass: 'ECONOMY'
    },
    {
      id: 2,
      scheduleId: 102,
      flightNumber: 'AI-505',
      airlineName: 'Air India',
      airlineCode: 'AI',
      airlineLogo: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=120&q=80',
      originIata: 'BLR',
      originCity: 'Bengaluru',
      originAirportName: 'Kempegowda International Airport',
      destinationIata: 'DEL',
      destinationCity: 'New Delhi',
      destinationAirportName: 'Indira Gandhi International Airport',
      departureTime: '08:00',
      arrivalTime: '10:45',
      travelDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      durationMinutes: 165,
      stops: 0,
      baseFare: 6400,
      taxAmount: 750,
      totalPrice: 7150,
      isRefundable: true,
      cabinBaggageKg: 7,
      checkinBaggageKg: 25,
      availableSeats: 98,
      aircraftModel: 'Boeing 737 MAX 8',
      cabinClass: 'ECONOMY'
    },
    {
      id: 3,
      scheduleId: 103,
      flightNumber: '6E-208',
      airlineName: 'IndiGo',
      airlineCode: '6E',
      airlineLogo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=120&q=80',
      originIata: 'BLR',
      originCity: 'Bengaluru',
      originAirportName: 'Kempegowda International Airport',
      destinationIata: 'BOM',
      destinationCity: 'Mumbai',
      destinationAirportName: 'Chhatrapati Shivaji Maharaj Intl Airport',
      departureTime: '09:15',
      arrivalTime: '10:55',
      travelDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      durationMinutes: 100,
      stops: 0,
      baseFare: 4200,
      taxAmount: 550,
      totalPrice: 4750,
      isRefundable: true,
      cabinBaggageKg: 7,
      checkinBaggageKg: 15,
      availableSeats: 88,
      aircraftModel: 'Airbus A320neo',
      cabinClass: 'ECONOMY'
    },
    {
      id: 4,
      scheduleId: 104,
      flightNumber: 'QP-1351',
      airlineName: 'Akasa Air',
      airlineCode: 'QP',
      airlineLogo: 'https://images.unsplash.com/photo-1517479149777-5f3b1511d7ad?auto=format&fit=crop&w=120&q=80',
      originIata: 'BLR',
      originCity: 'Bengaluru',
      originAirportName: 'Kempegowda International Airport',
      destinationIata: 'BOM',
      destinationCity: 'Mumbai',
      destinationAirportName: 'Chhatrapati Shivaji Maharaj Intl Airport',
      departureTime: '14:20',
      arrivalTime: '16:00',
      travelDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      durationMinutes: 100,
      stops: 0,
      baseFare: 3850,
      taxAmount: 480,
      totalPrice: 4330,
      isRefundable: true,
      cabinBaggageKg: 7,
      checkinBaggageKg: 15,
      availableSeats: 110,
      aircraftModel: 'Boeing 737 MAX',
      cabinClass: 'ECONOMY'
    },
    {
      id: 5,
      scheduleId: 105,
      flightNumber: 'EK-565',
      airlineName: 'Emirates',
      airlineCode: 'EK',
      airlineLogo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=120&q=80',
      originIata: 'BLR',
      originCity: 'Bengaluru',
      originAirportName: 'Kempegowda International Airport',
      destinationIata: 'DXB',
      destinationCity: 'Dubai',
      destinationAirportName: 'Dubai International Airport',
      departureTime: '10:30',
      arrivalTime: '13:15',
      travelDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      durationMinutes: 255,
      stops: 0,
      baseFare: 18500,
      taxAmount: 2400,
      totalPrice: 20900,
      isRefundable: true,
      cabinBaggageKg: 7,
      checkinBaggageKg: 30,
      availableSeats: 64,
      aircraftModel: 'Boeing 777-300ER',
      cabinClass: 'ECONOMY'
    },
    {
      id: 6,
      scheduleId: 106,
      flightNumber: 'SQ-509',
      airlineName: 'Singapore Airlines',
      airlineCode: 'SQ',
      airlineLogo: 'https://images.unsplash.com/photo-1520437358207-323b43b50729?auto=format&fit=crop&w=120&q=80',
      originIata: 'BLR',
      originCity: 'Bengaluru',
      originAirportName: 'Kempegowda International Airport',
      destinationIata: 'SIN',
      destinationCity: 'Singapore',
      destinationAirportName: 'Singapore Changi Airport',
      departureTime: '23:10',
      arrivalTime: '06:10',
      travelDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      durationMinutes: 270,
      stops: 0,
      baseFare: 22000,
      taxAmount: 3100,
      totalPrice: 25100,
      isRefundable: true,
      cabinBaggageKg: 7,
      checkinBaggageKg: 30,
      availableSeats: 52,
      aircraftModel: 'Airbus A350-900',
      cabinClass: 'ECONOMY'
    }
  ];

  public bookings: BookingResponseDto[] = [
    {
      id: 1,
      pnr: 'SK8942',
      bookingStatus: 'CONFIRMED',
      cabinClass: 'ECONOMY',
      passengerCount: 1,
      baseAmount: 5800,
      seatCharges: 250,
      addonCharges: 299,
      taxAmount: 699,
      discountAmount: 0,
      totalAmount: 7048,
      contactEmail: 'john.doe@example.com',
      contactPhone: '+91 9876543210',
      specialRequests: 'Window seat preference',
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      flight: {
        id: 1,
        scheduleId: 101,
        flightNumber: '6E-1234',
        airlineName: 'IndiGo',
        airlineCode: '6E',
        airlineLogo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=120&q=80',
        originIata: 'BLR',
        originCity: 'Bengaluru',
        originAirportName: 'Kempegowda International Airport',
        destinationIata: 'DEL',
        destinationCity: 'New Delhi',
        destinationAirportName: 'Indira Gandhi International Airport',
        departureTime: '06:30',
        arrivalTime: '09:20',
        travelDate: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
        durationMinutes: 170,
        stops: 0,
        baseFare: 5800,
        taxAmount: 699,
        totalPrice: 6499,
        isRefundable: true,
        cabinBaggageKg: 7,
        checkinBaggageKg: 15,
        availableSeats: 140,
        aircraftModel: 'Airbus A320neo',
        cabinClass: 'ECONOMY'
      },
      passengers: [
        {
          id: 1,
          firstName: 'Johnathan',
          lastName: 'Doe',
          dateOfBirth: '1992-06-15',
          gender: 'MALE',
          passengerType: 'ADULT',
          seatNumber: '14A',
          insuranceOpted: true
        }
      ],
      paymentStatus: 'SUCCESS',
      isCancellable: true,
      eligibleRefundAmount: 6548
    }
  ];

  public refunds: RefundDto[] = [
    {
      id: 1,
      bookingId: 99,
      pnr: 'SK1029',
      userEmail: 'sarah.connor@example.com',
      userName: 'Sarah Connor',
      refundAmount: 6200,
      refundReference: 'REF_99824X',
      refundStatus: 'PROCESSING',
      cancellationReason: 'Change of travel dates',
      requestDate: new Date(Date.now() - 3600000 * 12).toISOString(),
      adminNotes: 'Awaiting banking batch settlement'
    }
  ];

  public notifications: NotificationDto[] = [
    {
      id: 1,
      title: 'Web Check-in is Open',
      message: 'Web check-in is now live for flight 6E-1234 (BLR → DEL). Select your seat and download your digital boarding pass.',
      notificationType: 'CHECKIN',
      isRead: false,
      pnr: 'SK8942',
      flightNumber: '6E-1234',
      priority: 'HIGH',
      createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString()
    },
    {
      id: 2,
      title: 'Gate Assignment Update',
      message: 'Flight 6E-1234 departure gate has been assigned to Terminal 2, Gate 18B. Boarding starts at 05:45 AM.',
      notificationType: 'GATE_CHANGE',
      isRead: false,
      pnr: 'SK8942',
      flightNumber: '6E-1234',
      priority: 'URGENT',
      createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString()
    },
    {
      id: 3,
      title: 'Booking Confirmed: BLR → DEL',
      message: 'Your electronic ticket for PNR SK8942 is confirmed. Total ₹7,048 paid via Secure Gateway.',
      notificationType: 'BOOKING',
      isRead: true,
      pnr: 'SK8942',
      flightNumber: '6E-1234',
      priority: 'NORMAL',
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 4,
      title: 'Special Weekend Fare Drop',
      message: 'Flash Sale: Bengaluru (BLR) to Mumbai (BOM) flights starting at just ₹3,850 this weekend!',
      notificationType: 'OFFER',
      isRead: true,
      priority: 'NORMAL',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
    }
  ];

  public registeredUsers: User[] = [
    {
      id: 1,
      email: 'admin@skyroute.com',
      fullName: 'SkyRoute Operations Admin',
      phoneNumber: '+91 9876543210',
      roles: ['ROLE_ADMIN', 'ROLE_USER']
    },
    {
      id: 2,
      email: 'john.doe@example.com',
      fullName: 'Johnathan Doe',
      phoneNumber: '+91 9123456789',
      roles: ['ROLE_USER']
    }
  ];

  public currentUser: User | null = {
    id: 2,
    email: 'john.doe@example.com',
    fullName: 'Johnathan Doe',
    phoneNumber: '+91 9123456789',
    roles: ['ROLE_USER']
  };

  private constructor() {
    this.loadPersistedState();
  }

  public static getInstance(): SkyRouteStore {
    if (!SkyRouteStore.instance) {
      SkyRouteStore.instance = new SkyRouteStore();
    }
    return SkyRouteStore.instance;
  }

  private loadPersistedState() {
    try {
      const savedUser = localStorage.getItem('skyroute_user');
      if (savedUser) {
        this.currentUser = JSON.parse(savedUser);
      }
      const savedUsersList = localStorage.getItem('skyroute_registered_users');
      if (savedUsersList) {
        this.registeredUsers = JSON.parse(savedUsersList);
      }
      const savedBookings = localStorage.getItem('skyroute_bookings');
      if (savedBookings) {
        this.bookings = JSON.parse(savedBookings);
      }
      const savedNotifications = localStorage.getItem('skyroute_notifications');
      if (savedNotifications) {
        this.notifications = JSON.parse(savedNotifications);
      }
    } catch {
      // ignore
    }
  }

  public persistState() {
    try {
      if (this.currentUser) {
        localStorage.setItem('skyroute_user', JSON.stringify(this.currentUser));
      } else {
        localStorage.removeItem('skyroute_user');
      }
      localStorage.setItem('skyroute_registered_users', JSON.stringify(this.registeredUsers));
      localStorage.setItem('skyroute_bookings', JSON.stringify(this.bookings));
      localStorage.setItem('skyroute_notifications', JSON.stringify(this.notifications));
    } catch {
      // ignore
    }
  }

  public addNotification(dto: Omit<NotificationDto, 'id' | 'createdAt' | 'isRead'> & { id?: number; createdAt?: string; isRead?: boolean }): NotificationDto {
    const newNotification: NotificationDto = {
      id: dto.id || (this.notifications.length > 0 ? Math.max(...this.notifications.map(n => n.id)) + 1 : 1),
      title: dto.title,
      message: dto.message,
      notificationType: dto.notificationType,
      isRead: dto.isRead ?? false,
      createdAt: dto.createdAt || new Date().toISOString(),
      actionUrl: dto.actionUrl,
      pnr: dto.pnr,
      flightNumber: dto.flightNumber,
      priority: dto.priority || 'NORMAL'
    };
    this.notifications.unshift(newNotification);
    this.persistState();
    return newNotification;
  }

  public markNotificationAsRead(id: number) {
    const n = this.notifications.find(item => item.id === id);
    if (n) {
      n.isRead = true;
      this.persistState();
    }
  }

  public markAllNotificationsAsRead() {
    this.notifications.forEach(n => {
      n.isRead = true;
    });
    this.persistState();
  }

  public deleteNotification(id: number) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.persistState();
  }

  public clearAllNotifications() {
    this.notifications = [];
    this.persistState();
  }

  public getUnreadNotificationCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  public registerOrLogin(fullName: string, email: string): User {
    const cleanEmail = email.trim().toLowerCase();
    const isAdmin = cleanEmail.includes('admin');
    
    // Check if user already exists
    let existing = this.registeredUsers.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      if (fullName && fullName.trim()) {
        existing.fullName = fullName.trim();
      }
      this.currentUser = existing;
    } else {
      // Generate formatted name if none provided
      let derivedName = fullName?.trim();
      if (!derivedName) {
        const namePart = cleanEmail.split('@')[0];
        derivedName = namePart
          .replace(/[._-]/g, ' ')
          .replace(/\d+/g, '')
          .trim()
          .split(' ')
          .filter(Boolean)
          .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(' ') || 'Passenger';
      }

      const newUser: User = {
        id: this.registeredUsers.length + 1,
        email: cleanEmail,
        fullName: derivedName,
        phoneNumber: '+91 9876543210',
        roles: isAdmin ? ['ROLE_ADMIN', 'ROLE_USER'] : ['ROLE_USER']
      };

      this.registeredUsers.push(newUser);
      this.currentUser = newUser;
    }

    this.persistState();
    return this.currentUser;
  }

  public getSeatsForSchedule(scheduleId: number): SeatDto[] {
    const seats: SeatDto[] = [];
    const cols = ['A', 'B', 'C', 'D', 'E', 'F'];
    for (let r = 1; r <= 30; r++) {
      for (const col of cols) {
        const seatNumber = `${r}${col}`;
        const seatType = (col === 'A' || col === 'F') ? 'WINDOW' : (col === 'C' || col === 'D') ? 'AISLE' : 'MIDDLE';
        const cabinClass = (r <= 3) ? 'BUSINESS' : (r <= 6) ? 'PREMIUM_ECONOMY' : 'ECONOMY';
        const surcharge = (r <= 3) ? 1500 : (r === 12 || r === 13) ? 600 : (seatType === 'WINDOW' || seatType === 'AISLE') ? 250 : 0;
        
        // Mark some realistic occupied seats
        const isBooked = (r % 3 === 0 && (col === 'A' || col === 'C')) || (r === 14 && col === 'A');

        seats.push({
          id: r * 10 + cols.indexOf(col),
          seatNumber,
          cabinClass,
          seatType: (r === 12 || r === 13) ? 'EMERGENCY_EXIT' : seatType,
          priceSurcharge: surcharge,
          isBooked,
          isBlocked: false
        });
      }
    }
    return seats;
  }

  public searchFlights(origin: string, destination: string, travelDate: string, cabinClass: string = 'ECONOMY'): FlightResponseDto[] {
    const origAirport = this.airports.find(a => a.iataCode === origin) || { iataCode: origin, city: origin, name: `${origin} Airport` };
    const destAirport = this.airports.find(a => a.iataCode === destination) || { iataCode: destination, city: destination, name: `${destination} Airport` };

    // Check if there are exact matching seeded flights
    const exactMatches = this.flights.filter(f => f.originIata === origin && f.destinationIata === destination);

    if (exactMatches.length > 0) {
      return exactMatches.map(f => ({
        ...f,
        travelDate: travelDate || f.travelDate,
        cabinClass: cabinClass || f.cabinClass
      }));
    }

    // Generate dynamic realistic airline flights for this route
    const isInternational = ['DXB', 'SIN', 'LHR'].includes(origin) || ['DXB', 'SIN', 'LHR'].includes(destination);
    const airlinesPool = isInternational
      ? this.airlines.filter(a => ['EK', 'SQ', 'BA', 'AI'].includes(a.iataCode))
      : this.airlines.filter(a => ['6E', 'AI', 'QP'].includes(a.iataCode));

    const generatedFlights: FlightResponseDto[] = [];
    const scheduleTimes = [
      { dep: '06:15', arr: '08:45', dur: 150, stops: 0, mult: 1.0 },
      { dep: '09:40', arr: '12:20', dur: 160, stops: 0, mult: 1.1 },
      { dep: '14:30', arr: '17:10', dur: 160, stops: 0, mult: 0.95 },
      { dep: '18:50', arr: '21:35', dur: 165, stops: 0, mult: 1.15 },
      { dep: '21:15', arr: '01:05', dur: 230, stops: 1, mult: 0.85 }
    ];

    const baseFareMap: Record<string, number> = {
      'BLR-DEL': 5800, 'DEL-BLR': 5900,
      'BLR-BOM': 4200, 'BOM-BLR': 4300,
      'DEL-BOM': 4800, 'BOM-DEL': 4900,
      'BLR-DXB': 18500, 'DXB-BLR': 19200,
      'BLR-SIN': 22000, 'SIN-BLR': 22500,
      'DEL-SIN': 24000, 'SIN-DEL': 24500,
      'DEL-DXB': 17500, 'DXB-DEL': 18000,
      'BLR-HYD': 3200, 'HYD-BLR': 3300,
      'BLR-MAA': 2800, 'MAA-BLR': 2900,
      'BLR-GOI': 3500, 'GOI-BLR': 3600,
      'DEL-GOI': 6200, 'GOI-DEL': 6300,
      'BOM-GOI': 3100, 'GOI-BOM': 3200
    };

    const routeKey = `${origin}-${destination}`;
    const standardBaseFare = baseFareMap[routeKey] || (isInternational ? 21000 : 5200);

    airlinesPool.forEach((airline, index) => {
      const sch = scheduleTimes[index % scheduleTimes.length];
      const baseFare = Math.round(standardBaseFare * sch.mult * (airline.iataCode === 'AI' || airline.iataCode === 'EK' ? 1.12 : 1.0));
      const taxAmount = Math.round(baseFare * 0.12);
      const flightNumber = `${airline.iataCode}-${200 + index * 45 + (origin.charCodeAt(0) % 50)}`;

      generatedFlights.push({
        id: 1000 + index * 10 + Math.floor(Math.random() * 9),
        scheduleId: 2000 + index * 10 + Math.floor(Math.random() * 9),
        flightNumber,
        airlineName: airline.name,
        airlineCode: airline.iataCode,
        airlineLogo: airline.logoUrl,
        originIata: origin,
        originCity: origAirport.city,
        originAirportName: origAirport.name,
        destinationIata: destination,
        destinationCity: destAirport.city,
        destinationAirportName: destAirport.name,
        departureTime: sch.dep,
        arrivalTime: sch.arr,
        travelDate: travelDate || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        durationMinutes: sch.dur,
        stops: sch.stops,
        baseFare,
        taxAmount,
        totalPrice: baseFare + taxAmount,
        isRefundable: true,
        cabinBaggageKg: 7,
        checkinBaggageKg: isInternational ? 30 : 15,
        availableSeats: 80 + index * 12,
        aircraftModel: isInternational ? 'Boeing 777-300ER' : 'Airbus A320neo',
        cabinClass: cabinClass || 'ECONOMY'
      });
    });

    return generatedFlights;
  }

  public createBooking(booking: Omit<BookingResponseDto, 'id' | 'createdAt'>): BookingResponseDto {
    const newBooking: BookingResponseDto = {
      ...booking,
      id: this.bookings.length > 0 ? Math.max(...this.bookings.map(b => b.id)) + 1 : 1,
      createdAt: new Date().toISOString()
    };
    this.bookings.unshift(newBooking);
    this.persistState();
    return newBooking;
  }
}
