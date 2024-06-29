import React from 'react';
import { Modal } from "@/components/Modal";
import { Button, Text, Callout } from "@tremor/react";
import { CloudEmbeddingModel } from '../components/types';


// 2. Select Model
export function SelectModelModal({
  model,
  onConfirm,
  onCancel,
}: {
  model: CloudEmbeddingModel;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal title={`Elevate Your Game with ${model.name}`} onOutsideClick={onCancel}>
      <div className="mb-4">
        <Text className="text-lg mb-2">
          You&apos;re about to supercharge your setup with {model.name}.
          <br />
          Ready to push the envelope?
        </Text>
        <Callout title="Model Specs" color="blue" className="mt-4">
          <div className="flex flex-col gap-y-2">
            <p>TL;DR: {model.description}</p>
            <p>Dimensions: {model.model_dim} (That&apos;s {model.model_dim > 1000 ? 'beefy' : 'lean'})</p>
            <p>Damage to your wallet: ${model.pricePerMillion}/million tokens (Estimated monthly burn rate: $50-$500)</p>
          </div>
        </Callout>
        <div className="flex mt-8 justify-between">
          <Button color="gray" onClick={onCancel}>Abort Mission</Button>
          <Button color="green" onClick={onConfirm}>Ship It</Button>
        </div>
      </div>
    </Modal>
  );
}