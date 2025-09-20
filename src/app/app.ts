import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgFor } from '@angular/common';
import { signal } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [
      RouterOutlet,
      ReactiveFormsModule,
      NgFor // <- bez tego *ngFor nie działa
      ],
  templateUrl: './app.component.html',
  styles: [],
})
export class App {

    protected readonly title = 'WebFluxDemoWebClient';
    form: FormGroup;
    messages = signal<string[]>([]);

    constructor(private fb: FormBuilder) {
        this.form = this.fb.group({
            urlPath: ['https://sasana.wdfiles.com/local--files/dlaczego-czynimy-zlo/zuo.txt', [Validators.required, Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]],
        });
    }

  submit() {
      const eventsContainer = document.getElementById("messages") as HTMLDivElement;

      const eventSource = new EventSource("http://localhost:8080/eventsWww");

      // Function to create and append a new paragraph with event data
      function appendEventMessage(message: string, isError = false) {
        const p = document.createElement("p");
        p.textContent = message;
        if (isError) {
          p.style.color = 'red';
        }
        eventsContainer.appendChild(p);
        // Auto-scroll to the bottom
        eventsContainer.scrollTop = eventsContainer.scrollHeight;
      }

      eventSource.addEventListener("www-content", (event: MessageEvent) => {
        appendEventMessage(event.data);
      });

      eventSource.onopen = () => {
        // appendEventMessage("✅ Połączono z serwerem zdarzeń");
      };

      eventSource.onerror = () => {
        // appendEventMessage("❌ Błąd połączenia SSE", true);
        eventSource.close();
      };

      // Add a message when the page loads
      window.addEventListener('load', () => {
        appendEventMessage("Oczekiwanie na zdarzenia...");
      });
  }
}
