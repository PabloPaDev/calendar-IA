"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Settings,
  Menu,
  Clock,
  MapPin,
  Users,
  Calendar,
  Pause,
  Sparkles,
  X,
  Edit,
} from "lucide-react"
import { format, addDays, subDays, addMonths, subMonths, addYears, subYears, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns"
import { es } from "date-fns/locale"

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [showSplash, setShowSplash] = useState(true)
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const [isValidating, setIsValidating] = useState(false)
  const [userName, setUserName] = useState("")
  const [showAIPopup, setShowAIPopup] = useState(false)
  const [typedText, setTypedText] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)
  const [showPlanning, setShowPlanning] = useState(false)
  const [tasks, setTasks] = useState<Array<{ id: string, text: string, completed: boolean }>>([])
  const [newTask, setNewTask] = useState("")
  const [showEventModal, setShowEventModal] = useState(false)
  const [isEditingEvent, setIsEditingEvent] = useState(false)
  const [editingEventId, setEditingEventId] = useState<number | null>(null)
  const [newEvent, setNewEvent] = useState({
    title: "",
    startTime: "09:00",
    endTime: "10:00",
    day: 1,
    description: ""
  })

  useEffect(() => {
    // Verificar si ya hay un email guardado en localStorage
    const savedEmail = localStorage.getItem('agendia_user_email')
    if (savedEmail) {
      // Extraer el nombre del usuario del email
      const name = savedEmail.split('@')[0]
      setUserName(name)
      setShowSplash(false)
      setIsLoaded(true)

      // Cargar eventos guardados
      const savedEvents = localStorage.getItem('agendia_events')
      if (savedEvents) {
        setEvents(JSON.parse(savedEvents))
      }

      // Show AI popup after 3 seconds
      const popupTimer = setTimeout(() => {
        setShowAIPopup(true)
      }, 3000)

      return () => clearTimeout(popupTimer)
    }
  }, [])

  // Función para validar email
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Función para manejar el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsValidating(true)
    setEmailError("")

    if (!email.trim()) {
      setEmailError("Por favor, ingresa tu correo electrónico")
      setIsValidating(false)
      return
    }

    if (!validateEmail(email)) {
      setEmailError("Por favor, ingresa un correo electrónico válido")
      setIsValidating(false)
      return
    }

    // Guardar email en localStorage
    localStorage.setItem('agendia_user_email', email)

    // Extraer el nombre del usuario del email
    const name = email.split('@')[0]
    setUserName(name)

    // Ocultar splash screen con animación suave
    setTimeout(() => {
      setShowSplash(false)
      setIsLoaded(true)
    }, 500)

    // Show AI popup after 3 seconds
    setTimeout(() => {
      setShowAIPopup(true)
    }, 3500)

    setIsValidating(false)
  }

  useEffect(() => {
    if (showAIPopup) {
      const text =
        "LLooks like you don't have that many meetings today. Shall I play some Hans Zimmer essentials to help you get into your Flow State?"
      let i = 0
      const typingInterval = setInterval(() => {
        if (i < text.length) {
          setTypedText((prev) => prev + text.charAt(i))
          i++
        } else {
          clearInterval(typingInterval)
        }
      }, 50)

      return () => clearInterval(typingInterval)
    }
  }, [showAIPopup])

  const [currentView, setCurrentView] = useState("week")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedEvent, setSelectedEvent] = useState<any>(null)

  // Funciones para navegar entre fechas
  const goToToday = () => {
    setCurrentDate(new Date())
    setShowPlanning(true)
    loadTasks()
  }

  const goToPrevious = () => {
    if (currentView === "day") {
      setCurrentDate(subDays(currentDate, 1))
    } else if (currentView === "week") {
      setCurrentDate(subDays(currentDate, 7))
    } else if (currentView === "month") {
      setCurrentDate(subMonths(currentDate, 1))
    }
  }

  const goToNext = () => {
    if (currentView === "day") {
      setCurrentDate(addDays(currentDate, 1))
    } else if (currentView === "week") {
      setCurrentDate(addDays(currentDate, 7))
    } else if (currentView === "month") {
      setCurrentDate(addMonths(currentDate, 1))
    }
  }

  // Funciones para navegar a vistas específicas basadas en el día seleccionado
  const goToDayView = () => {
    setCurrentView("day")
    // Mantener la fecha actual, solo cambiar la vista
  }

  const goToWeekView = () => {
    setCurrentView("week")
    // Mantener la fecha actual, solo cambiar la vista
  }

  const goToMonthView = () => {
    setCurrentView("month")
    // Mantener la fecha actual, solo cambiar la vista
  }

  // Obtener fechas de la semana actual
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 })
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 })
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

  // Formatear fechas para mostrar
  const currentMonthFormatted = format(currentDate, "MMMM yyyy", { locale: es }).replace(/^\w/, c => c.toUpperCase())
  const currentDateFormatted = format(currentDate, "MMMM d", { locale: es }).replace(/^\w/, c => c.toUpperCase())

  const handleEventClick = (event) => {
    setSelectedEvent(event)
  }

  // Array de eventos vacío - listo para añadir eventos personalizados
  const [events, setEvents] = useState<Array<{
    id: number
    title: string
    startTime: string
    endTime: string
    color: string
    day: number
    description: string
    location: string
    attendees: string[]
    organizer: string
  }>>([
    {
      id: 1,
      title: "Evento de prueba - Lunes",
      startTime: "09:00",
      endTime: "10:00",
      color: "bg-blue-500",
      day: 2, // Lunes
      description: "Este es un evento de prueba para el lunes",
      location: "",
      attendees: [],
      organizer: "Tú"
    },
    {
      id: 2,
      title: "Evento de prueba - Martes",
      startTime: "14:00",
      endTime: "15:00",
      color: "bg-green-500",
      day: 3, // Martes
      description: "Este es un evento de prueba para el martes",
      location: "",
      attendees: [],
      organizer: "Tú"
    },
    {
      id: 3,
      title: "Evento de prueba - Miércoles",
      startTime: "11:00",
      endTime: "12:00",
      color: "bg-purple-500",
      day: 4, // Miércoles
      description: "Este es un evento de prueba para el miércoles",
      location: "",
      attendees: [],
      organizer: "Tú"
    }
  ])

  // Nombres de días de la semana
  const weekDayNames = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"]
  const timeSlots = Array.from({ length: 15 }, (_, i) => i + 8) // 8 AM to 10 PM

  // Helper function to calculate event position and height
  const calculateEventStyle = (startTime, endTime) => {
    const start = Number.parseInt(startTime.split(":")[0]) + Number.parseInt(startTime.split(":")[1]) / 60
    const end = Number.parseInt(endTime.split(":")[0]) + Number.parseInt(endTime.split(":")[1]) / 60
    const top = (start - 8) * 80 // 80px per hour
    const height = (end - start) * 80
    return { top: `${top}px`, height: `${height}px` }
  }

  // Sample calendar for mini calendar
  const daysInMonth = 31
  const firstDayOffset = 5 // Friday is the first day of the month in this example
  const miniCalendarDays = Array.from({ length: daysInMonth + firstDayOffset }, (_, i) =>
    i < firstDayOffset ? null : i - firstDayOffset + 1,
  )

  // Función para cargar tareas del día seleccionado
  const loadSelectedDayTasks = () => {
    if (typeof window !== 'undefined') {
      const selectedDate = format(currentDate, 'yyyy-MM-dd')
      const savedTasks = localStorage.getItem(`agendia_tasks_${selectedDate}`)
      if (savedTasks) {
        return JSON.parse(savedTasks)
      }
    }
    return []
  }

  // Tareas del día seleccionado
  const [selectedDayTasks, setSelectedDayTasks] = useState([])

  // Función para actualizar las tareas del día seleccionado
  const updateSelectedDayTasks = () => {
    const tasks = loadSelectedDayTasks()
    setSelectedDayTasks(tasks)
  }

  // Cargar tareas del día seleccionado al cambiar de día
  useEffect(() => {
    updateSelectedDayTasks()
  }, [currentDate])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
    // Here you would typically also control the actual audio playback
  }

  // Funciones para manejar las tareas del planning diario
  const loadTasks = () => {
    const today = format(new Date(), 'yyyy-MM-dd')
    const savedTasks = localStorage.getItem(`agendia_tasks_${today}`)
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    } else {
      setTasks([])
    }
    // Actualizar las tareas del día seleccionado
    updateSelectedDayTasks()
  }

  const saveTasks = (tasksToSave: Array<{ id: string, text: string, completed: boolean }>) => {
    const today = format(new Date(), 'yyyy-MM-dd')
    localStorage.setItem(`agendia_tasks_${today}`, JSON.stringify(tasksToSave))
  }

  const addTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTask.trim()) {
      const newTaskObj = {
        id: Date.now().toString(),
        text: newTask.trim(),
        completed: false
      }
      const updatedTasks = [...tasks, newTaskObj]
      setTasks(updatedTasks)
      saveTasks(updatedTasks)
      setNewTask("")
      // Actualizar las tareas del día seleccionado
      updateSelectedDayTasks()
    }
  }

  const toggleTask = (taskId: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    )
    setTasks(updatedTasks)
    saveTasks(updatedTasks)
    // Actualizar las tareas del día seleccionado
    updateSelectedDayTasks()
  }

  const deleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId)
    setTasks(updatedTasks)
    saveTasks(updatedTasks)
    // Actualizar las tareas del día seleccionado
    updateSelectedDayTasks()
  }

  const goBackToCalendar = () => {
    setShowPlanning(false)
  }

  // Funciones para manejar la creación de eventos
  const openEventModal = () => {
    setIsEditingEvent(false)
    setEditingEventId(null)
    setShowEventModal(true)
  }

  const openEditEventModal = (event: any) => {
    setIsEditingEvent(true)
    setEditingEventId(event.id)
    setNewEvent({
      title: event.title,
      startTime: event.startTime,
      endTime: event.endTime,
      day: event.day,
      description: event.description
    })
    setShowEventModal(true)
  }

  const closeEventModal = () => {
    setShowEventModal(false)
    setIsEditingEvent(false)
    setEditingEventId(null)
    setNewEvent({
      title: "",
      startTime: "09:00",
      endTime: "10:00",
      day: 1,
      description: ""
    })
  }

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newEvent.title.trim()) {
      alert("Por favor, ingresa un título para el evento")
      return
    }

    if (isEditingEvent && editingEventId) {
      // Editar evento existente
      const updatedEvents = events.map(event =>
        event.id === editingEventId
          ? {
            ...event,
            title: newEvent.title,
            startTime: newEvent.startTime,
            endTime: newEvent.endTime,
            day: newEvent.day,
            description: newEvent.description
          }
          : event
      )
      setEvents(updatedEvents)
      localStorage.setItem('agendia_events', JSON.stringify(updatedEvents))
    } else {
      // Crear nuevo evento
      const eventToAdd = {
        id: Date.now(),
        title: newEvent.title,
        startTime: newEvent.startTime,
        endTime: newEvent.endTime,
        color: "bg-blue-500", // Color por defecto
        day: newEvent.day,
        description: newEvent.description,
        location: "",
        attendees: [],
        organizer: userName || "Tú"
      }

      const updatedEvents = [...events, eventToAdd]
      setEvents(updatedEvents)
      localStorage.setItem('agendia_events', JSON.stringify(updatedEvents))
    }

    closeEventModal()
  }

  const deleteEvent = (eventId: number) => {
    const updatedEvents = events.filter(event => event.id !== eventId)
    setEvents(updatedEvents)
    localStorage.setItem('agendia_events', JSON.stringify(updatedEvents))
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Splash Screen / Login Screen */}
      {showSplash && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 transition-all duration-1500 ease-in-out ${!showSplash ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            }`}
          style={{
            animation: showSplash ? 'fadeInScale 0.8s ease-out' : 'fadeOutScale 1.2s ease-in-out'
          }}
        >
          <div className="text-center max-w-md w-full px-6">
            <h1
              className="text-6xl md:text-8xl font-bold text-white mb-4 tracking-wider"
              style={{
                animation: 'slideInUp 1.2s ease-out 0.2s both',
                textShadow: '0 4px 8px rgba(0,0,0,0.3)'
              }}
            >
              AgendIA
            </h1>
            <div
              className="w-16 h-1 bg-white mx-auto rounded-full mb-8"
              style={{
                animation: 'expandWidth 1.8s ease-out 0.8s both'
              }}
            ></div>
            <div
              className="mb-8 text-white/80 text-lg font-light"
              style={{
                animation: 'fadeInUp 1s ease-out 1.5s both'
              }}
            >
              Tu agenda inteligente
            </div>

            {/* Login Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
              style={{
                animation: 'fadeInUp 1s ease-out 2s both'
              }}
            >
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ingresa tu correo electrónico"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder:text-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-200"
                  disabled={isValidating}
                />
                {emailError && (
                  <p className="text-red-300 text-sm mt-2 text-left">
                    {emailError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isValidating}
                className="w-full px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-medium rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isValidating ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Background Image */}
      <Image
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop"
        alt="Beautiful mountain landscape"
        fill
        className="object-cover"
        priority
      />

      {/* Main App Content - Hidden initially */}
      <div id="app" className={`${showSplash ? 'opacity-0 scale-105' : 'opacity-100 scale-100'} transition-all duration-1500 ease-in-out`}>
        {/* Navigation */}
        <header
          className={`absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-8 py-6 opacity-0 ${isLoaded ? "animate-fade-in" : ""}`}
          style={{ animationDelay: "0.2s" }}
        >
          <div className="flex items-center gap-4">
            <Menu className="h-6 w-6 text-white" />
            <span className="text-2xl font-semibold text-white drop-shadow-lg">Agend-IA</span>
            {userName && (
              <span className="text-white/80 text-sm">
                Hola, {userName.charAt(0).toUpperCase() + userName.slice(1)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
              <input
                type="text"
                placeholder="Search"
                className="rounded-full bg-white/10 backdrop-blur-sm pl-10 pr-4 py-2 text-white placeholder:text-white/70 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>
            <Settings className="h-6 w-6 text-white drop-shadow-md" />
            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold shadow-md">
              U
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="relative h-screen w-full pt-20 flex">
          {/* Sidebar */}
          <div
            className={`w-64 h-full bg-white/10 backdrop-blur-lg p-4 shadow-xl border-r border-white/20 rounded-tr-3xl opacity-0 ${isLoaded ? "animate-fade-in" : ""} flex flex-col justify-between`}
            style={{ animationDelay: "0.4s" }}
          >
            <div>
              <button
                onClick={openEventModal}
                className="mb-6 flex items-center justify-center gap-2 rounded-full bg-blue-500 px-4 py-3 text-white w-full hover:bg-blue-600 transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span>Añadir</span>
              </button>

              {/* Mini Calendar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-medium">{currentMonthFormatted}</h3>
                  <div className="flex gap-1">
                    <button
                      className="p-1 rounded-full hover:bg-white/20"
                      onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                    >
                      <ChevronLeft className="h-4 w-4 text-white" />
                    </button>
                    <button
                      className="p-1 rounded-full hover:bg-white/20"
                      onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                    >
                      <ChevronRight className="h-4 w-4 text-white" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center">
                  {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                    <div key={i} className="text-xs text-white/70 font-medium py-1">
                      {day}
                    </div>
                  ))}

                  {miniCalendarDays.map((day, i) => (
                    <div
                      key={i}
                      className={`text-xs rounded-full w-7 h-7 flex items-center justify-center cursor-pointer transition-colors ${day === Number(format(currentDate, "d")) ? "bg-blue-500 text-white" : "text-white hover:bg-white/20"
                        } ${!day ? "invisible" : ""}`}
                      onClick={() => {
                        if (day) {
                          const newDate = new Date(currentDate)
                          newDate.setDate(day)
                          setCurrentDate(newDate)
                        }
                      }}
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tareas del día seleccionado */}
              <div>
                <h3 className="text-white font-medium mb-3">
                  Tareas del {format(currentDate, 'd \'de\' MMMM', { locale: es }).replace(/^\w/, c => c.toUpperCase())}
                </h3>
                <div className="space-y-2">
                  {selectedDayTasks.length === 0 ? (
                    <p className="text-white/50 text-sm">
                      No hay tareas para este día
                    </p>
                  ) : (
                    selectedDayTasks.map((task: { id: string, text: string, completed: boolean }) => (
                      <div key={task.id} className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-sm ${task.completed ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                        <span className={`text-white text-sm ${task.completed ? 'line-through opacity-50' : ''}`}>
                          {task.text}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Eventos del día seleccionado */}
              <div className="mt-6">
                <h3 className="text-white font-medium mb-3">
                  Eventos del {format(currentDate, 'd \'de\' MMMM', { locale: es }).replace(/^\w/, c => c.toUpperCase())}
                </h3>
                <div className="space-y-2">
                  {(() => {
                    // Mapear el día actual a un número (1=Domingo, 2=Lunes, etc.)
                    const dayMap: { [key: string]: number } = {
                      'Sun': 1, 'Mon': 2, 'Tue': 3, 'Wed': 4, 'Thu': 5, 'Fri': 6, 'Sat': 7
                    };
                    const currentDay = format(currentDate, 'E');
                    const currentDayNumber = dayMap[currentDay] || 1;

                    console.log('Día actual:', currentDay, 'Número:', currentDayNumber);
                    console.log('Eventos disponibles:', events);

                    const dayEvents = events.filter(event => event.day === currentDayNumber);
                    console.log('Eventos del día:', dayEvents);

                    if (dayEvents.length === 0) {
                      return (
                        <p className="text-white/50 text-sm">
                          No hay eventos para este día
                        </p>
                      );
                    }

                    return dayEvents.map((event) => (
                      <div key={event.id} className="flex items-center gap-3 p-2 rounded-lg bg-white/10">
                        <div className={`w-3 h-3 rounded-sm ${event.color}`}></div>
                        <div className="flex-1">
                          <div className="text-white text-sm font-medium">{event.title}</div>
                          <div className="text-white/70 text-xs">{event.startTime} - {event.endTime}</div>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => openEditEventModal(event)}
                            className="text-blue-400 hover:text-blue-300 transition-colors p-1"
                            title="Editar evento"
                          >
                            <Edit className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => deleteEvent(event.id)}
                            className="text-red-400 hover:text-red-300 transition-colors p-1"
                            title="Eliminar evento"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </div>

            {/* New position for the big plus button */}
            <button className="mt-6 flex items-center justify-center gap-2 rounded-full bg-blue-500 p-4 text-white w-14 h-14 self-start">
              <Plus className="h-6 w-6" />
            </button>
          </div>

          {/* Calendar View */}
          <div
            className={`flex-1 flex flex-col opacity-0 ${isLoaded ? "animate-fade-in" : ""}`}
            style={{ animationDelay: "0.6s" }}
          >
            {/* Calendar Controls */}
            <div className="flex items-center justify-between p-4 border-b border-white/20">
              <div className="flex items-center gap-4">
                <button
                  className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
                  onClick={goToToday}
                >
                  Today
                </button>
                <div className="flex">
                  <button
                    className="p-2 text-white hover:bg-white/10 rounded-l-md transition-colors"
                    onClick={goToPrevious}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    className="p-2 text-white hover:bg-white/10 rounded-r-md transition-colors"
                    onClick={goToNext}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
                <h2 className="text-xl font-semibold text-white">{currentDateFormatted}</h2>
              </div>

              <div className="flex items-center gap-2 rounded-md p-1">
                <button
                  onClick={goToDayView}
                  className={`px-3 py-1 rounded ${currentView === "day" ? "bg-white/20" : ""} text-white text-sm`}
                >
                  Day
                </button>
                <button
                  onClick={goToWeekView}
                  className={`px-3 py-1 rounded ${currentView === "week" ? "bg-white/20" : ""} text-white text-sm`}
                >
                  Week
                </button>
                <button
                  onClick={goToMonthView}
                  className={`px-3 py-1 rounded ${currentView === "month" ? "bg-white/20" : ""} text-white text-sm`}
                >
                  Month
                </button>
              </div>
            </div>

            {/* Planning Diario o Week View */}
            {showPlanning ? (
              <div className="flex-1 overflow-auto p-4">
                <div className="bg-white/20 backdrop-blur-lg rounded-xl border border-white/20 shadow-xl h-full p-6">
                  {/* Header del Planning */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">
                        Planning de hoy
                      </h2>
                      <p className="text-white/70">
                        {format(new Date(), 'EEEE, d \'de\' MMMM', { locale: es }).replace(/^\w/, c => c.toUpperCase())}
                      </p>
                    </div>
                    <button
                      onClick={goBackToCalendar}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Volver al calendario
                    </button>
                  </div>

                  {/* Formulario para añadir tareas */}
                  <form onSubmit={addTask} className="mb-6">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder="Añadir nueva tarea..."
                        className="flex-1 px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder:text-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-200"
                      />
                      <button
                        type="submit"
                        className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
                      >
                        Añadir
                      </button>
                    </div>
                  </form>

                  {/* Lista de tareas */}
                  <div className="space-y-3">
                    {tasks.length === 0 ? (
                      <p className="text-white/50 text-center py-8">
                        No hay tareas para hoy. ¡Añade una nueva tarea para comenzar!
                      </p>
                    ) : (
                      tasks.map((task) => (
                        <div
                          key={task.id}
                          className={`flex items-center gap-3 p-4 rounded-lg transition-all duration-200 ${task.completed
                            ? 'bg-white/5 border border-white/10'
                            : 'bg-white/10 border border-white/20'
                            }`}
                        >
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleTask(task.id)}
                            className="w-5 h-5 rounded border-white/30 bg-white/10 text-blue-500 focus:ring-blue-500 focus:ring-2"
                          />
                          <span
                            className={`flex-1 text-white ${task.completed ? 'line-through opacity-50' : ''
                              }`}
                          >
                            {task.text}
                          </span>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="text-red-400 hover:text-red-300 transition-colors p-1"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-auto p-4">
                <div className="bg-white/20 backdrop-blur-lg rounded-xl border border-white/20 shadow-xl min-h-screen">
                  {/* Week Header */}
                  <div className="grid grid-cols-8 border-b border-white/20">
                    <div className="p-2 text-center text-white/50 text-xs"></div>
                    {weekDays.map((day, i) => (
                      <div key={i} className="p-2 text-center border-l border-white/20">
                        <div className="text-xs text-white/70 font-medium">{weekDayNames[i]}</div>
                        <div
                          className={`text-lg font-medium mt-1 text-white ${format(day, "d") === format(currentDate, "d") &&
                            format(day, "M") === format(currentDate, "M") &&
                            format(day, "y") === format(currentDate, "y")
                            ? "bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center mx-auto"
                            : ""
                            }`}
                        >
                          {format(day, "d")}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Time Grid */}
                  <div className="grid grid-cols-8">
                    {/* Time Labels */}
                    <div className="text-white/70">
                      {timeSlots.map((time, i) => (
                        <div key={i} className="h-20 border-b border-white/10 pr-2 text-right text-xs">
                          {time > 12 ? `${time - 12} PM` : `${time} AM`}
                        </div>
                      ))}
                    </div>

                    {/* Days Columns */}
                    {Array.from({ length: 7 }).map((_, dayIndex) => (
                      <div key={dayIndex} className="border-l border-white/20 relative">
                        {timeSlots.map((_, timeIndex) => (
                          <div key={timeIndex} className="h-20 border-b border-white/10"></div>
                        ))}

                        {/* Events */}
                        {events
                          .filter((event) => event.day === dayIndex + 1)
                          .map((event, i) => {
                            const eventStyle = calculateEventStyle(event.startTime, event.endTime)
                            return (
                              <div
                                key={i}
                                className={`absolute ${event.color} rounded-md p-2 text-white text-xs shadow-md cursor-pointer transition-all duration-200 ease-in-out hover:translate-y-[-2px] hover:shadow-lg`}
                                style={{
                                  ...eventStyle,
                                  left: "4px",
                                  right: "4px",
                                }}
                                onClick={() => handleEventClick(event)}
                              >
                                <div className="font-medium">{event.title}</div>
                                <div className="opacity-80 text-[10px] mt-1">{`${event.startTime} - ${event.endTime}`}</div>
                              </div>
                            )
                          })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* AI Popup */}
          {showAIPopup && (
            <div className="fixed bottom-8 right-8 z-20">
              <div className="w-[450px] relative bg-gradient-to-br from-blue-400/30 via-blue-500/30 to-blue-600/30 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-blue-300/30 text-white">
                <button
                  onClick={() => setShowAIPopup(false)}
                  className="absolute top-2 right-2 text-white/70 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <Sparkles className="h-5 w-5 text-blue-300" />
                  </div>
                  <div className="min-h-[80px]">
                    <p className="text-base font-light">{typedText}</p>
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={togglePlay}
                    className="flex-1 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-sm transition-colors font-medium"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setShowAIPopup(false)}
                    className="flex-1 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-sm transition-colors font-medium"
                  >
                    No
                  </button>
                </div>
                {isPlaying && (
                  <div className="mt-4 flex items-center justify-between">
                    <button
                      className="flex items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-white text-sm hover:bg-white/20 transition-colors"
                      onClick={togglePlay}
                    >
                      <Pause className="h-4 w-4" />
                      <span>Pause Hans Zimmer</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedEvent && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className={`${selectedEvent.color} p-6 rounded-lg shadow-xl max-w-md w-full mx-4`}>
                <h3 className="text-2xl font-bold mb-4 text-white">{selectedEvent.title}</h3>
                <div className="space-y-3 text-white">
                  <p className="flex items-center">
                    <Clock className="mr-2 h-5 w-5" />
                    {`${selectedEvent.startTime} - ${selectedEvent.endTime}`}
                  </p>
                  <p className="flex items-center">
                    <MapPin className="mr-2 h-5 w-5" />
                    {selectedEvent.location}
                  </p>
                  <p className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    {format(currentDate, "EEEE, d 'de' MMMM", { locale: es }).replace(/^\w/, c => c.toUpperCase())}
                  </p>
                  <p className="flex items-start">
                    <Users className="mr-2 h-5 w-5 mt-1" />
                    <span>
                      <strong>Attendees:</strong>
                      <br />
                      {selectedEvent.attendees.join(", ") || "No attendees"}
                    </span>
                  </p>
                  <p>
                    <strong>Organizer:</strong> {selectedEvent.organizer}
                  </p>
                  <p>
                    <strong>Description:</strong> {selectedEvent.description}
                  </p>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    className="bg-white text-gray-800 px-4 py-2 rounded hover:bg-gray-100 transition-colors"
                    onClick={() => setSelectedEvent(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Floating Action Button - Removed */}
        </main>
      </div>

      {/* Modal para crear eventos */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-xl max-w-md w-full mx-4 border border-white/20 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                {isEditingEvent ? 'Editar evento' : 'Crear nuevo evento'}
              </h3>
              <button
                onClick={closeEventModal}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleEventSubmit} className="space-y-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Título del evento *
                </label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                  placeholder="Ej: Reunión de equipo"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Hora de inicio
                  </label>
                  <input
                    type="time"
                    value={newEvent.startTime}
                    onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Hora de fin
                  </label>
                  <input
                    type="time"
                    value={newEvent.endTime}
                    onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Día de la semana
                </label>
                <select
                  value={newEvent.day}
                  onChange={(e) => setNewEvent({ ...newEvent, day: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/30 relative z-10"
                  style={{ zIndex: 1000 }}
                >
                  <option value={1} className="bg-gray-800 text-white">Domingo</option>
                  <option value={2} className="bg-gray-800 text-white">Lunes</option>
                  <option value={3} className="bg-gray-800 text-white">Martes</option>
                  <option value={4} className="bg-gray-800 text-white">Miércoles</option>
                  <option value={5} className="bg-gray-800 text-white">Jueves</option>
                  <option value={6} className="bg-gray-800 text-white">Viernes</option>
                  <option value={7} className="bg-gray-800 text-white">Sábado</option>
                </select>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Descripción
                </label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                  placeholder="Descripción del evento..."
                  rows={3}
                />
              </div>



              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeEventModal}
                  className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  {isEditingEvent ? 'Guardar cambios' : 'Crear evento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeInScale {
          from { 
            opacity: 0; 
            transform: scale(0.95);
          }
          to { 
            opacity: 1; 
            transform: scale(1);
          }
        }
        
        @keyframes fadeOutScale {
          from { 
            opacity: 1; 
            transform: scale(1);
          }
          to { 
            opacity: 0; 
            transform: scale(1.05);
          }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes expandWidth {
          from {
            width: 0;
            opacity: 0;
          }
          to {
            width: 4rem;
            opacity: 1;
          }
        }
        
        .animate-fade-in {
          animation: fadeInScale 1s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
