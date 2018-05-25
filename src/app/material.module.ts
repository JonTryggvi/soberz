import { CdkTableModule } from '@angular/cdk/table';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule, MatCardModule, MatCheckboxModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, MatPaginatorModule, MatProgressSpinnerModule, MatSelectModule, MatSidenavModule, MatSlideToggleModule, MatSortModule, MatTableModule, MatTabsModule, MatToolbarModule, MatSnackBarModule } from '@angular/material';


@NgModule({
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSidenavModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatSlideToggleModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatListModule,
    MatCardModule,
    MatTabsModule,
    CdkTableModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,

  ],
  exports: [
    MatFormFieldModule,
    MatInputModule,
    MatSidenavModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatSlideToggleModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatListModule,
    MatCardModule,
    MatTabsModule,
    CdkTableModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,

  ]
})

export class MaterialModule {

}