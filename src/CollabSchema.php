<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle;

/**
 * 1.18: version of what the editor writes into a shared (Yjs) document. A host that keeps collaboration logs folds it
 * into its log epoch, so that a page's next session starts a new log and tabs of an older editor get the existing
 * `409 log_epoch` answer and reload (owner decision O7): before 1.18, every peer rewrote heading ids from their text
 * after each change, which would undo the stable ids of `stable_heading_ids`.
 *
 * Version 2 (1.18): heading nodes keep their own id. Version 1: everything before.
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
final class CollabSchema
{
    public const VERSION = 2;
}
