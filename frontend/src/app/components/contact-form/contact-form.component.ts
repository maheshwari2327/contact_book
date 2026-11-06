// Layer: Frontend Layer (Contact Form Component - Reactive Forms)
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Contact } from '../../models/contact.model';

/**
 * Standalone Angular component providing a Reactive Form for Adding and Editing contacts.
 * Enforces client-side validation rules:
 * - name: required, minimum 2 characters
 * - phone: required, exactly 10 numerical digits
 * - email: required, valid email format
 * - city: required
 */
@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent implements OnInit, OnChanges {

  // Input property to receive contact data when editing an existing contact
  @Input() contactToEdit: Contact | null = null;

  // Emits the validated contact payload upon form submission
  @Output() formSubmit = new EventEmitter<Contact>();

  // Emits when user clicks the Cancel button
  @Output() formCancel = new EventEmitter<void>();

  // The Reactive Form instance
  contactForm!: FormGroup;

  // Track if user attempted submission to display error messages eagerly
  submitted: boolean = false;

  // Injection of FormBuilder
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  // React to changes in contactToEdit input (e.g. user clicks Edit on a row)
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['contactToEdit'] && this.contactForm) {
      if (this.contactToEdit) {
        // Populate form with contact values for editing
        this.contactForm.patchValue({
          name: this.contactToEdit.name,
          phone: this.contactToEdit.phone,
          email: this.contactToEdit.email,
          city: this.contactToEdit.city,
          favorite: this.contactToEdit.favorite
        });
      } else {
        // Reset form for adding a new contact
        this.contactForm.reset({
          name: '',
          phone: '',
          email: '',
          city: '',
          favorite: false
        });
      }
      this.submitted = false;
    }
  }

  /**
   * Initializes the Reactive Form structure with validation rules.
   */
  private initForm(): void {
    this.contactForm = this.fb.group({
      name: [
        this.contactToEdit ? this.contactToEdit.name : '',
        [Validators.required, Validators.minLength(2)]
      ],
      phone: [
        this.contactToEdit ? this.contactToEdit.phone : '',
        [Validators.required, Validators.pattern('^[0-9]{10}$')]
      ],
      email: [
        this.contactToEdit ? this.contactToEdit.email : '',
        [Validators.required, Validators.email]
      ],
      city: [
        this.contactToEdit ? this.contactToEdit.city : '',
        [Validators.required]
      ],
      favorite: [
        this.contactToEdit ? this.contactToEdit.favorite : false
      ]
    });
  }

  // Convenience getter for easy template access to form controls
  get f() {
    return this.contactForm.controls;
  }

  /**
   * Handles form submission.
   * Validates controls and emits formSubmit event if valid.
   */
  onSubmit(): void {
    this.submitted = true;

    // Check if form is invalid; stop if errors exist
    if (this.contactForm.invalid) {
      // Mark all controls as touched to trigger CSS error highlights
      this.contactForm.markAllAsTouched();
      return;
    }

    // Build the payload
    const formValue = this.contactForm.value;
    const contactData: Contact = {
      id: this.contactToEdit ? this.contactToEdit.id : undefined,
      name: formValue.name.trim(),
      phone: formValue.phone.trim(),
      email: formValue.email.trim(),
      city: formValue.city.trim(),
      favorite: !!formValue.favorite
    };

    this.formSubmit.emit(contactData);
  }

  /**
   * Handles user cancellation.
   */
  onCancel(): void {
    this.contactForm.reset();
    this.submitted = false;
    this.formCancel.emit();
  }
}

