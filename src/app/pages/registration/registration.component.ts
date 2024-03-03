import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  MIN_PASSWORD_LENGTH,
  MIN_USER_NAME_LENGTH,
  SLEEPY_OPTIONS,
} from '../../shared/constants/form.constant';
import { RegistrationFormKey } from './enums/registration.enum';
import { RegistrationFormGroup } from './interfaces/registration.interface';
import { getTrimmedString } from '../../shared/helpers/input.helper';
import { LabelComponent } from '../../shared/components/form/label/label.component';
import { InputComponent } from '../../shared/components/form/input/input.component';
import { ErrorMessageComponent } from '../../shared/components/form/error-message/error-message.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';
import { AppPages } from '../../app.routes';
import { AuthUserService } from '../../shared/services/app/auth-user/auth-user.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  templateUrl: 'registration.component.html',
  styleUrl: 'registration.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    LabelComponent,
    InputComponent,
    ErrorMessageComponent,
    ButtonComponent,
  ],
})
export class RegistrationComponent implements OnInit {
  formGroup!: FormGroup<RegistrationFormGroup>;
  isLoading = false;

  readonly registrationFormKey = RegistrationFormKey;

  constructor(
    private readonly authUserService: AuthUserService,
    private readonly cdRef: ChangeDetectorRef,
    private readonly destroyRef: DestroyRef,
    private readonly fb: FormBuilder,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  onRegistration(): void {
    if (this.formGroup.disabled || this.isLoading) {
      return;
    }

    this.removeWhiteSpaceFromFields();

    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const { email, password, userName } = this.formGroup.getRawValue();
    this.isLoading = true;

    this.authUserService
      .registration$({ email, password })
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdRef.markForCheck();
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.router.navigate([AppPages.Messenger]));
  }

  private removeWhiteSpaceFromFields(): void {
    Object.values(this.formGroup.controls).forEach(
      (control: FormControl<string>) => {
        control.setValue(
          getTrimmedString(control.getRawValue()),
          SLEEPY_OPTIONS,
        );
      },
    );
  }

  private initForm(): void {
    this.fb.nonNullable.group({
      [RegistrationFormKey.Email]: ['', [Validators.required]],
      [RegistrationFormKey.Password]: [
        '',
        [Validators.required, Validators.minLength(MIN_PASSWORD_LENGTH)],
      ],
      [RegistrationFormKey.UserName]: [
        '',
        [Validators.required, Validators.minLength(MIN_USER_NAME_LENGTH)],
      ],
    });
  }
}
