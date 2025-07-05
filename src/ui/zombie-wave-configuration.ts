type FormDataType = Record<string, FormDataEntryValue>;

export type ConfigurationSubmittedEvent = {
  infinite: boolean;
  zombieCount: number;
  attackDirection: 'left' | 'right' | 'top' | 'down';
};

export class ZombieWaveConfiguration extends Phaser.Events.EventEmitter {
  form: HTMLFormElement;

  constructor() {
    super();
    this.form = document.getElementById(
      'wave-configuration'
    ) as HTMLFormElement;

    this.form.classList.add('visible');

    this.form.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = this.getFormData(event.target as HTMLFormElement);
      const eventData = this.getConfiguration(formData);

      this.emit('configurationSubmitted', eventData);
    });
  }

  private getFormData(target: HTMLFormElement): FormDataType {
    const formData = new FormData(target);
    return Object.fromEntries(formData.entries());
  }

  private getConfiguration(formData: FormDataType) {
    const zombieCount = parseInt(formData['zombies-count'] as string, 10);
    const infinite = formData['infinite'] || false;
    const attackDirection = formData['attack-direction'] as string;

    if (isNaN(zombieCount) || zombieCount <= 0 || !attackDirection) {
      alert('Configuration is invalid. Please check your inputs.');
      return;
    }

    return {
      infinite,
      zombieCount,
      attackDirection,
    };
  }
}
