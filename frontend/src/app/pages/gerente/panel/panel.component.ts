import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Importe o RouterModule

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [CommonModule, RouterModule], // Adicione o RouterModule aqui
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent {
  // Este componente será a "casca" do menu
}