<?php

declare(strict_types=1);

namespace App\Form;

use Nowo\FormKitBundle\Attribute\FormKitConfig;
use Nowo\FormKitBundle\Form\FormOptionsTrait;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

/**
 * REQ-DEMO-015: a FormKit form (profile `demo`) with CSRF. Every demo page lists its editors (`editors`: field name =>
 * MilkdownEditorType options); each one is added through FormKit's addMilkdownEditor(). The block prefix stays `form`
 * so the field names (`form[body]`, …) the e2e and the collaboration scripts post do not change.
 *
 * @extends AbstractType<array<string, mixed>>
 */
#[FormKitConfig('demo')]
final class MilkdownDemoType extends AbstractType
{
    use FormOptionsTrait;

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        if ($options['with_title']) {
            $this->addText($builder, 'title', [
                'label'              => 'demo.title',
                'translation_domain' => 'messages',
                'placeholder'        => false,
                'help'               => false,
            ]);
        }

        /** @var array<string, array<string, mixed>> $editors */
        $editors = $options['editors'];
        foreach ($editors as $name => $editorOptions) {
            $this->addMilkdownEditor($builder, $name, $editorOptions + [
                'placeholder'        => false,
                'help'               => false,
                'translation_domain' => 'messages',
            ]);
        }

        if ($options['submit']) {
            $this->addWithDefaults($builder, 'save', SubmitType::class, [
                'label'              => 'demo.save',
                'translation_domain' => 'messages',
                'attr'               => ['class' => 'nowo-ui-btn nowo-ui-btn--primary'],
            ]);
        }
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'editors'    => [],
            'with_title' => false,
            'submit'     => true,
        ]);
        $resolver->setAllowedTypes('editors', 'array');
        $resolver->setAllowedTypes('with_title', 'bool');
        $resolver->setAllowedTypes('submit', 'bool');
    }

    public function getBlockPrefix(): string
    {
        return 'form';
    }
}
