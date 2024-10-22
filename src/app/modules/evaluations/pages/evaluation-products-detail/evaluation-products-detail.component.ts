import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
// import { ProductService } from '../../../../core/services/api/product.service';
// import { EvaluationService } from '../../../../core/services/api/evaluation.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-evaluation-products-detail',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './evaluation-products-detail.component.html',
})
export class EvaluationProductsDetailComponent implements OnInit {
  products: any[] = [];
  newProduct: any | null = null;
  appointmentId!: number;
  errorMessage: string = '';
  isConfirmDialogVisible: boolean = false;

  constructor(
    private route: ActivatedRoute,
    // private productService: ProductService,
    // private evaluationService: EvaluationService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.appointmentId = +id;
      this.loadProducts();
    } else {
      this.errorMessage = 'ID de la evaluación no encontrado.';
    }
  }

  loadProducts(): void {
    /*
    this.productService.getProductLinesByEvaluationId(this.appointmentId).subscribe(
      (response) => {
        this.products = response.result;
        if (this.products.length === 0) {
          this.handleError('No hay productos disponibles para esta evaluación.');
        }
      },
      (error) => {
        if (error.status === 404) {
          this.handleError('No se encontraron productos para la evaluación especificada.');
        } else {
          this.handleError('Error al cargar los productos.');
        }
        console.error('Error al cargar los productos:', error);
      }
    );
    */
  }

  updateProduct(product: any): void {
    if (product.quantity > 2) {
      this.handleError('La cantidad no puede ser mayor a 2.');
      return;
    }

    /*
    this.productService.updateProductLinesById(product.id, product).subscribe(
      () => {
        const index = this.products.findIndex(p => p.id === product.id);
        if (index !== -1) {
          this.products[index] = { ...product };
        }
      },
      (error) => {
        this.handleError('Error al actualizar el producto.');
        console.error('Error al actualizar el producto:', error);
      }
    );
    */
  }

  deleteProduct(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      /*
      this.productService.deleteProductLine(id).subscribe(
        () => {
          this.loadProducts();
        },
        (error) => {
          this.handleError('Error al eliminar el producto.');
          console.error('Error al eliminar el producto:', error);
        }
      );
      */
    }
  }

  addProduct(): void {
    this.newProduct = {
      id: 0,
      id_date: this.appointmentId,
      erp_product: '',
      erp_supplying_code: '',
      quantity: 1,
      size: '',
      mode: 'input',
      pending: true
    };
  }

  saveNewProduct(): void {
    if (this.newProduct) {
      if (this.newProduct.quantity > 2) {
        this.handleError('La cantidad no puede ser mayor a 2.');
        return;
      }

      /*
      this.productService.createProductLineById(this.newProduct).subscribe(
        () => {
          this.loadProducts();
          this.newProduct = null;
        },
        (error) => {
          this.handleError('Error al guardar el nuevo producto.');
          console.error('Error al guardar el nuevo producto:', error);
        }
      );
      */
    }
  }

  cancelNewProduct(): void {
    this.newProduct = null;
  }

  openConfirmDialog(): void {
    this.isConfirmDialogVisible = true;
  }

  confirmEnlistment(): void {
    this.isConfirmDialogVisible = false;
    /*
    this.evaluationService.confirmEnlistment(this.appointmentId).subscribe(
      (result) => {
        alert('Alistamiento confirmado');
      },
      (error) => {
        alert('Error al Completar Alistamiento');
        console.error('Error al confirmar el alistamiento:', error);
      });
    */
  }

  cancelEnlistment(): void {
    this.isConfirmDialogVisible = false;
  }

  private handleError(message: string): void {
    this.errorMessage = message;
    setTimeout(() => this.errorMessage = '', 5000);
  }
}
