import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxPrintModule } from 'ngx-print';
// import { EvaluationService } from '../../../../core/services/api/evaluation.service';
// import { ProductService } from '../../../../core/services/api/product.service';
// import { FileService } from '../../../../core/services/api/file.service';
// import { DateEventService } from '../../../../core/services/api/date-event.service';

@Component({
  selector: 'app-evaluation-pdf-detail',
  standalone: true,
  imports: [CommonModule, NgxPrintModule],
  templateUrl: './evaluation-pdf-detail.component.html',
})
export class EvaluationPDFDetailComponent implements OnInit {
  printTitle: string = 'EntregaDotacion';
  evaluationId!: number;
  evaluation: any = {};

  deliveredProducts: any[] = [];
  pendingProducts: any[] = [];
  returnedProducts: any[] = [];

  evaluationEvents: any[] = [];
  isLoading: boolean = true;
  singUrl: string | null = null;
  photoUrl: string | null = null;

  constructor(
    private route: ActivatedRoute,
    // private evaluationService: EvaluationService,
    // private productService: ProductService,
    // private fileService: FileService,
    // private dateEventService: DateEventService
  ) {}

  ngOnInit(): void {
    this.evaluationId = +this.route.snapshot.paramMap.get('id')!;
    this.loadEvaluationData(this.evaluationId);
    this.loadEvaluationEvents(this.evaluationId);
    this.printTitle = `EntregaDotacion_ID_${this.evaluationId}`;
  }

  private loadEvaluationData(id: number): void {
    this.isLoading = true;
    /*
    this.evaluationService.getEvaluationById(id).subscribe(
      response => {
        this.evaluation = response.result[0] || {};
        this.loadProducts(id);
        this.loadSing();
        this.loadPhoto();
        this.isLoading = false;
      },
      error => {
        console.error('Error fetching evaluation:', error);
        this.isLoading = false;
      }
    );
    */
  }

  private loadEvaluationEvents(id: number): void {
    this.isLoading = true;
    /*
    this.dateEventService.getEventsByDate(id).subscribe(
      response => {
        this.evaluationEvents = response.result || [];
      },
      error => {
        console.error('Error fetching evaluation events:', error);
      }
    );
    */
  }

  private loadProducts(evaluationId: number): void {
    /*
    this.productService.getProductLinesByEvaluationId(evaluationId).subscribe(
      response => {
        const products = response.result || [];

        this.deliveredProducts = products.filter(product => product.mode === 'output' && !product.pending);
        this.pendingProducts = products.filter(product => product.pending);
        this.returnedProducts = products.filter(product => product.mode === 'input' && !product.pending);
      },
      error => {
        console.error('Error fetching products:', error);
      }
    );
    */
  }

  private loadSing(): void {
    /*
    const fileName = `${this.evaluation.dni}/${this.evaluationId}/sign.png`;

    this.fileService.getFile(fileName).subscribe(
      blob => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          this.singUrl = `data:image/png;base64,${base64data.split(',')[1]}`;
        };
        reader.readAsDataURL(blob);
      },
      error => {
        console.error('Error fetching image:', error);
      }
    );
    */
  }

  private loadPhoto(): void {
    /*
    const fileName = `${this.evaluation.dni}/${this.evaluationId}/photo.png`;

    this.fileService.getFile(fileName).subscribe(
      blob => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          this.photoUrl = `data:image/png;base64,${base64data.split(',')[1]}`;
        };
        reader.readAsDataURL(blob);
      },
      error => {
        console.error('Error fetching image:', error);
      }
    );
    */
  }
}
