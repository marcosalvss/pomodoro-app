import { Component, computed, effect, signal, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

type TimerMode = 'pomodoro' | 'short' | 'long';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Main Layout: Flex row on Desktop, Column on Mobile -->
    <div class="min-h-screen flex flex-col md:flex-row font-inter">

      <!-- Left Panel: Timer -->
      <div class="
        w-full md:w-1/2 
        h-[80vh] md:h-screen 
        fixed md:relative 
        top-0 left-0 
        flex flex-col items-center justify-center 
        bg-cover bg-center 
        text-white
        z-0"
        style="background-image: linear-gradient(rgba(158, 226, 0, 0.5), rgba(158, 226, 0, 0.5)), url('https://github.com/lucasbeskow/clock/blob/main/forest.jpg?raw=true');">
        
        <div class="w-full max-w-md p-8 flex flex-col items-center text-center">
          <h1 class="text-4xl md:text-5xl font-black mb-10 drop-shadow-md">Pomodoro 2025.2</h1>

          <div class="flex gap-2 mb-8 flex-wrap justify-center">
            <button 
              (click)="setMode('pomodoro')" 
              [class]="mode() === 'pomodoro' ? 'bg-black text-white' : 'text-white hover:bg-black/20'"
              class="px-4 py-2 rounded font-bold text-lg md:text-xl transition-all duration-200">
              Pomodoro
            </button>
            <button 
              (click)="setMode('short')" 
              [class]="mode() === 'short' ? 'bg-black text-white' : 'text-white hover:bg-black/20'"
              class="px-4 py-2 rounded font-bold text-lg md:text-xl transition-all duration-200">
              Pausa curta
            </button>
            <button 
              (click)="setMode('long')" 
              [class]="mode() === 'long' ? 'bg-black text-white' : 'text-white hover:bg-black/20'"
              class="px-4 py-2 rounded font-bold text-lg md:text-xl transition-all duration-200">
              Pausa longa
            </button>
          </div>

          <div class="flex-grow flex flex-col justify-center mb-8">
            <div class="text-[6rem] md:text-[8rem] font-black leading-none drop-shadow-lg">
              {{ formattedTime() }}
            </div>
            <div class="text-2xl font-bold bg-black/10 inline-block px-4 py-2 rounded-full mt-4 backdrop-blur-sm">
              #{{ cycleCount() }} {{ modeLabel() }}
            </div>
          </div>

          <div class="flex gap-4">
            @if (!isRunning()) {
              <button 
                (click)="toggleTimer()"
                class="bg-black text-white text-3xl px-8 py-4 rounded font-bold hover:scale-105 transition-transform shadow-lg">
                Iniciar
              </button>
            } @else {
              <button 
                (click)="toggleTimer()"
                class="bg-black text-white text-3xl px-8 py-4 rounded font-bold hover:scale-105 transition-transform shadow-lg">
                Pausar
              </button>
            }
            
            <button 
              (click)="stopTimer()" 
              class="text-white text-xl px-6 py-4 font-bold hover:bg-white/20 rounded transition-colors">
              Finalizar
            </button>
          </div>
        </div>
      </div>

      <!-- Right Panel: Tasks -->
      <div class="
        w-full md:w-1/2 
        bg-white 
        relative md:static 
        z-10 
        mt-[75vh] md:mt-0 
        min-h-[50vh] md:min-h-screen
        rounded-t-[32px] md:rounded-none
        shadow-[0_-10px_40px_rgba(0,0,0,0.2)] md:shadow-none
        flex flex-col
        p-6 md:p-20">

        <div class="flex justify-between items-end mb-8 border-b pb-6 border-gray-100">
          <h2 class="text-3xl font-bold text-gray-800">Tarefas</h2>
          <button 
            (click)="toggleHideCompleted()" 
            [class.bg-black]="hideCompleted()"
            [class.text-white]="hideCompleted()"
            class="px-4 py-2 rounded font-bold text-sm transition-colors border border-gray-200 hover:bg-gray-100">
            {{ hideCompleted() ? 'Mostrar finalizadas' : 'Ocultar finalizadas' }}
          </button>
        </div>

        <ul class="flex flex-col gap-4 mb-8">
          @for (task of visibleTasks(); track task.id) {
            <li class="flex items-center p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow group">
              
              <div class="relative flex items-center justify-center w-6 h-6 mr-4">
                <input 
                  type="checkbox" 
                  [id]="'task-' + task.id" 
                  [checked]="task.completed"
                  (change)="toggleTask(task.id)"
                  class="peer appearance-none w-6 h-6 border-2 border-gray-300 rounded cursor-pointer checked:bg-[#9EE200] checked:border-[#9EE200] transition-colors"
                >
                <i class="fa-solid fa-check text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none text-xs"></i>
              </div>

              <label 
                [for]="'task-' + task.id" 
                [class.line-through]="task.completed"
                [class.text-gray-400]="task.completed"
                class="flex-grow text-lg font-medium cursor-pointer select-none text-gray-700">
                {{ task.title }}
              </label>

              <button (click)="deleteTask(task.id)" class="text-gray-300 hover:text-red-500 transition-colors p-2">
                <i class="fa-solid fa-trash"></i>
              </button>
            </li>
          }
        </ul>

        @if (isAddingTask()) {
          <div class="animate-fade-in mb-4">
            <input 
              #newTaskInput
              type="text" 
              [(ngModel)]="newTaskTitle"
              (keydown.enter)="confirmAddTask()"
              (blur)="cancelAddTask()"
              placeholder="Digite sua tarefa..." 
              class="w-full text-2xl p-4 border-b-2 border-[#9EE200] focus:outline-none bg-transparent placeholder-gray-400"
            >
            <div class="text-xs text-gray-400 mt-2">Pressione Enter para salvar</div>
          </div>
        } @else {
           <button 
            (click)="startAddingTask()" 
            class="w-full py-6 border-2 border-dashed border-[#9EE200] text-[#9EE200] font-bold text-xl rounded-lg hover:bg-[#9EE200]/10 transition-colors flex items-center justify-center gap-2">
            <i class="fa-solid fa-plus"></i> Nova Tarefa
          </button>
        }

      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,100..900&display=swap');
    
    :host {
      display: block;
    }

    .font-inter {
      font-family: "Inter", sans-serif;
    }

    ::-webkit-scrollbar {
      width: 8px;
    }
    ::-webkit-scrollbar-track {
      background: transparent;
    }
    ::-webkit-scrollbar-thumb {
      background: #ddd;
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #ccc;
    }

    .animate-fade-in {
      animation: fadeIn 0.3s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class App implements OnDestroy {
  @ViewChild('newTaskInput') newTaskInput!: ElementRef;

  timeLeft = signal(25 * 60);
  initialTime = signal(25 * 60);
  mode = signal<TimerMode>('pomodoro');
  isRunning = signal(false);
  cycleCount = signal(1);
  
  tasks = signal<Task[]>([
    { id: 1, title: 'Criar o HTML do Pomodoro App', completed: true },
    { id: 2, title: 'Aplicar estilos CSS', completed: true },
    { id: 3, title: 'Adicionar interatividade com Angular', completed: false },
  ]);
  
  hideCompleted = signal(false);
  isAddingTask = signal(false);
  newTaskTitle = '';

  private timerInterval: any;

  formattedTime = computed(() => {
    const minutes = Math.floor(this.timeLeft() / 60);
    const seconds = this.timeLeft() % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  });

  modeLabel = computed(() => {
    switch (this.mode()) {
      case 'pomodoro': return 'Pomodoro';
      case 'short': return 'Pausa Curta';
      case 'long': return 'Pausa Longa';
      default: return '';
    }
  });

  visibleTasks = computed(() => {
    if (this.hideCompleted()) {
      return this.tasks().filter(t => !t.completed);
    }
    return this.tasks();
  });

  constructor() {
    effect(() => {
      document.title = `${this.formattedTime()} - ${this.modeLabel()}`;
    });
  }

  ngOnDestroy() {
    this.clearTimer();
  }

  toggleTimer() {
    if (this.isRunning()) {
      this.pauseTimer();
    } else {
      this.startTimer();
    }
  }

  startTimer() {
    this.isRunning.set(true);
    this.timerInterval = setInterval(() => {
      if (this.timeLeft() > 0) {
        this.timeLeft.update(v => v - 1);
      } else {
        this.completeTimer();
      }
    }, 1000);
  }

  pauseTimer() {
    this.isRunning.set(false);
    this.clearTimer();
  }

  stopTimer() {
    this.pauseTimer();
    this.timeLeft.set(this.initialTime());
  }

  completeTimer() {
    this.pauseTimer();
    if (this.mode() === 'pomodoro') {
      this.cycleCount.update(c => c + 1);
    }
    this.timeLeft.set(this.initialTime()); 
  }

  clearTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  setMode(mode: TimerMode) {
    this.mode.set(mode);
    this.pauseTimer();
    
    switch (mode) {
      case 'pomodoro':
        this.initialTime.set(25 * 60);
        break;
      case 'short':
        this.initialTime.set(5 * 60);
        break;
      case 'long':
        this.initialTime.set(15 * 60);
        break;
    }
    this.timeLeft.set(this.initialTime());
  }

  toggleTask(id: number) {
    this.tasks.update(tasks => 
      tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    );
  }

  deleteTask(id: number) {
    this.tasks.update(tasks => tasks.filter(t => t.id !== id));
  }

  toggleHideCompleted() {
    this.hideCompleted.update(v => !v);
  }

  startAddingTask() {
    this.isAddingTask.set(true);
    this.newTaskTitle = '';
    setTimeout(() => this.newTaskInput.nativeElement.focus(), 0);
  }

  cancelAddTask() {
    setTimeout(() => {
      if (this.newTaskTitle.trim() === '') {
        this.isAddingTask.set(false);
      }
    }, 100);
  }

  confirmAddTask() {
    if (this.newTaskTitle.trim()) {
      this.tasks.update(tasks => [
        ...tasks,
        { id: Date.now(), title: this.newTaskTitle, completed: false }
      ]);
      this.newTaskTitle = '';
      this.isAddingTask.set(false);
    }
  }
}